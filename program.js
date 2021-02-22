// /* -------------------- */
// /*    Sample program    */
// /* -------------------- */


// variables for the hardware
let gamepadConnected = false;
let hub01 = null;
let movehub = null;
let motorA = null;
let led = null;

// variables for the program
let manualMode = false;
let speed = 0;


// PoweredUP initialization

const PoweredUP = require("node-poweredup");
const poweredUP = new PoweredUP.PoweredUP();

poweredUP.on("discover", async (device) => {
  await device.connect(); 

  if (device.type === PoweredUP.Consts.HubType.MOVE_HUB) { // Identified by hardware type
    motorA = await device.waitForDeviceAtPort("A");
    led = await device.waitForDeviceByType(PoweredUP.Consts.DeviceType.HUB_LED);
    movehub = device;
    console.log('Move hub connected');
  } 
  // else if (device.name === 'Hub01') { // Identified by hub name which can be configured in the Powered Up app 
  //   hub01 = device;
  //   console.log('City Hub "Hub01" connected');
  // }

  checkHardware();
});

poweredUP.scan(); // Start scanning for Hubs
console.log("Scanning for Hubs...");


// Gamepad callbacks

exports.onGamepadConnect = () => {
  gamepadConnected = true;
  console.log('Gamepad connected');

  checkHardware();
};

exports.onButtonPress = (buttonId) => {
  switch (buttonId) {
    case 0:
      setManualMode(true);
      break;
    case 1:
      setManualMode(false);
      break;
    case 2:
      runSequence();
      break;
  }
};

exports.onButtonRelease = (buttonId) => {
  // User code here ...
};

exports.onAxeMoved = (axeId, value) => {
  switch (axeId) {
    case 1:
      setPower(value);
      break;
  }
};


// Userdefined functions

function checkHardware() {
  // if (gamepadConnected && movehub && hub01) {
  //   autorun();
  // }
  if (gamepadConnected && movehub) {
    autorun();
  }
}

async function setManualMode(enabled) {
  if (enabled) {
    manualMode = true;
    led.setColor(PoweredUP.Consts.Color.YELLOW);
    console.log('Manual mode enabled');
  } else {
    manualMode = false;
    led.setColor(PoweredUP.Consts.Color.PURPLE);
    motorA.setPower(0);
    console.log('Manual mode disabled');
  }
}

async function autorun() {
  led.setColor(PoweredUP.Consts.Color.PURPLE);
}

async function setPower(value) {
  if (manualMode) {
    motorA.setPower(value);
  }
}

async function runSequence() {
  motorA.setPower(20);
  await movehub.sleep(1000);
  motorA.setPower(50);
  await movehub.sleep(1000);
  motorA.setPower(0);
}

