/****Rajesh K Jeyapaul*****/
/*****IBM Eco sys Development ****/

var Client = require("ibmiotf");
var sleep = require("sleep");

var deviceConfig = new require("./device.json");
var deviceClient = new Client.IotfDevice(deviceConfig);

var groveSensor = require('jsupm_grove');
var led = new groveSensor.GroveLed(3);
var temp = new groveSensor.GroveTemp(0);

var groveBuzzer = require("jsupm_buzzer");
var buzz = new groveBuzzer.Buzzer(5);
var chords =[];
chords.push(groveBuzzer.DO);
chords.push(groveBuzzer.RE);
/*chords.push(groveBuzzer.MI);
chords.push(groveBuzzer.FA);
chords.push(groveBuzzer.SOL);
chords.push(groveBuzzer.LA);
chords.push(groveBuzzer.SI);
chords.push(groveBuzzer.DO);
chords.push(groveBuzzer.SI); */
var chordIndex=0;

var getTemp = function() {
        var cel=temp.value();
        console.log("current Temp is " + cel);
        return cel.toFixed(4);
};


console.log("1. LED connected to "+led.name());
console.log("2. Buzzer connected to " +buzz.name());
console.log("3. Temp sensor connected to " +temp.name());

function melody()
{
        if (chords.length !=0)
        {
                console.log(buzz.playSound(chords[chordIndex],1000000));
                chordIndex++;
                if (chordIndex > chords.length -1)
                        chords.length =0;
                        //exit();
        }
        buzz.stopSound();
}

//setInterval(melody,100);

process.on("SIGINT",function()
                {
                        console.log("Exiting...");
                        process.exit(0);
                });

deviceClient.connect();
deviceClient.log.setLevel('debug');
deviceClient.on("connect", function() {
        console.log("successfully connected to IoTF");
        //appClient.subscribeToDeviceEvents("cognitivehome");
        console.log("Sending Temperature data to Watson IoT platform");
//setInterval(melody,10);
        //sleep.usleep(10);
/*      led.on();
        console.log("LED ON");
        sleep.usleep(10);
        led.off();
        console.log("LED OFF");
        buzz.stopSound();*/

        setInterval(function() {
                deviceClient.publish("status","json",'{"d":{"temp":' +getTemp() +'}}'); },2000);
});

deviceClient.on("command", function(commandName,format,payload,topic) {
        console.log("COmmand received");
        console.log("payload received:"+payload);
        if(commandName == "onoff") {
        if(payload == "1") {
                console.log("friend"+payload);
                //setInterval(led.on(),10);
led.on();
                //sleep.usleep(10000);
                //led.off();
        } else if (payload =="0") {
                console.log("foe");
        //      setInterval(melody,10);
                melody();
        } else {
                console.log("command not supported.."+commandName);
        }
        }
});
