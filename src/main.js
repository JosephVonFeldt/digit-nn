let drawing = false;
let canv = document.getElementById('numCanvas');
let clr = document.getElementById("clear");
const ctx = canv.getContext("2d");
ctx.save();
await ctx.beginPath()
var chromiumIssue1092080WorkaroundOverlay = document.querySelector('.chromium-issue-1092080-workaround__overlay');

import Module from './nn.js'

Module().then(function (mymod) {

    let length = 784;

    let offset = 0
    let array1 = new Float64Array(mymod.asm.memory.buffer, offset, length);
    array1.set(Array(784).fill(0.0))
    offset += length * Float64Array.BYTES_PER_ELEMENT;
    length = 10;
    let result = new Float64Array(mymod.asm.memory.buffer, offset, length);
    result.set(Array(10).fill(0.0))
    let hasDrawn = false;

    //var guessNum = mymod.cwrap("guessNum", null, ["number", "number"]);

    function addVal(x, y, v) {
        x += 2
        y += 3
        //y = Math.min(y + 3, 27)
        if (x < 0 || y < 0) {
            return
        }
        if (v == null) {
            v = 1
        }
        //y = 28-y
        let ind = y * 28 + x
        let val = array1.at(ind)
        if (val < v) {
            array1.set([val + .3 * v], ind);
            //fun();
        }
    }

    function addToArr(dx, dy) {
        addVal(Math.floor(dx / 20), Math.floor(dy / 20), 1.5);
        addVal(Math.floor(dx / 20 + .5), Math.floor(dy / 20), .8);
        addVal(Math.floor(dx / 20 - .5), Math.floor(dy / 20), .8);
        addVal(Math.floor(dx / 20), Math.floor(dy / 20 + .5), .8);
        addVal(Math.floor(dx / 20), Math.floor(dy / 20 - .5), .8);

        addVal(Math.floor(dx / 20 + 1), Math.floor(dy / 20 + 1), .75);
        addVal(Math.floor(dx / 20 + 1), Math.floor(dy / 20 - 1), .75);
        addVal(Math.floor(dx / 20 - 1), Math.floor(dy / 20 + 1), .75);
        addVal(Math.floor(dx / 20 - 1), Math.floor(dy / 20 - 1), .75);

        addVal(Math.floor(dx / 20), Math.floor(dy / 20 + 1), .65);
        addVal(Math.floor(dx / 20), Math.floor(dy / 20 - 1), .65);
        addVal(Math.floor(dx / 20), Math.floor(dy / 20 + 1), .65);
        addVal(Math.floor(dx / 20), Math.floor(dy / 20 - 1), .65);
        addVal(Math.floor(dx / 20 + 1), Math.floor(dy / 20), .65);
        addVal(Math.floor(dx / 20 + 1), Math.floor(dy / 20), .65);
        addVal(Math.floor(dx / 20 - 1), Math.floor(dy / 20), .65);
        addVal(Math.floor(dx / 20 - 1), Math.floor(dy / 20), .65);

        addVal(Math.floor(dx / 20 + 2), Math.floor(dy / 20), .55);
        addVal(Math.floor(dx / 20 - 2), Math.floor(dy / 20), .55);
        addVal(Math.floor(dx / 20), Math.floor(dy / 20 + 2), .55);
        addVal(Math.floor(dx / 20), Math.floor(dy / 20 - 2), .55);

        addVal(Math.floor(dx / 20 + 2), Math.floor(dy / 20 + 1), .35);
        addVal(Math.floor(dx / 20 + 2), Math.floor(dy / 20 - 1), .35);
        addVal(Math.floor(dx / 20 - 2), Math.floor(dy / 20 + 1), .35);
        addVal(Math.floor(dx / 20 - 2), Math.floor(dy / 20 - 1), .35);
        addVal(Math.floor(dx / 20 + 1), Math.floor(dy / 20 + 2), .35);
        addVal(Math.floor(dx / 20 + 1), Math.floor(dy / 20 - 2), .35);
        addVal(Math.floor(dx / 20 - 1), Math.floor(dy / 20 + 2), .35);
        addVal(Math.floor(dx / 20 - 1), Math.floor(dy / 20 - 2), .35);
    }

    async function draw(e) {
        if (drawing) {
            let dx = Math.round(e.clientX - e.target.getBoundingClientRect().left) - 10;
            let dy = Math.round(e.clientY - e.target.getBoundingClientRect().top) - 10;
            dx = Math.max(dx, 0);
            dx = Math.min(dx, 560);
            dy = Math.max(dy, 0);
            dy = Math.min(dy, 560);
            ctx.fillStyle = "black";
            await ctx.rect(dx - 20, dy - 20, 40, 40);
            //ctx.fill();
            //ctx.fillStyle = "black";
            //ctx.fillRect(Math.floor(dx/20)*20-10, Math.floor(dy/20)*20-10, 40, 40);
            hasDrawn = true;
            addToArr(Math.floor(dx / 20) * 20, Math.floor(dy / 20) * 20)
        }
    }

    async function drawMobile(e) {
        if (drawing) {
            mobile(e);
            let dx = Math.round(e.touches[0].clientX - e.target.getBoundingClientRect().left) - 10;
            let dy = Math.round(e.touches[0].clientY - e.target.getBoundingClientRect().top) - 10;
            dx = Math.max(dx, 0);
            dx = Math.min(dx, 560);
            dy = Math.max(dy, 0);
            dy = Math.min(dy, 560);
            ctx.fillStyle = "black";
            await ctx.rect(dx - 20, dy - 20, 40, 40);
            //ctx.fill();
            hasDrawn = true;
            addToArr(Math.floor(dx / 20) * 20, Math.floor(dy / 20) * 20)
        }
    }

    function mobile(e) {
        e.preventDefault();
        e.stopImmediatePropagation();
    }

    function start() {
        drawing = true;
    }

    function end() {
        drawing = false;
    }

    canv.addEventListener("mousemove", draw);
    canv.addEventListener("mousedown", start);
    document.addEventListener("mouseup", end);
    canv.addEventListener("touchmove", drawMobile);
    canv.addEventListener("touchstart", start);
    document.addEventListener("touchend", end);
    document.addEventListener("touchmove", mobile, {passive: false});
    document.addEventListener("dblclick", mobile, {passive: false});

    function fun() {
        result.set(Array(10).fill(0.0))
        if (hasDrawn && !drawing) {
            mymod._guessNum(
                array1.byteOffset,
                result.byteOffset);
            // Show the results.
            if (!drawing) {
                let tot = 0;
                for (let i = 0; i < 10; i++) {
                    tot +=  result.at(i);
                }
                for (let i = 0; i < 10; i++) {
                    let val = result.at(i)/tot;
                    document.getElementById(i.toString()).textContent = val.toFixed(5);
                    if (val > .5) {
                        document.getElementById(i.toString()).parentElement.classList.remove("close");
                        document.getElementById(i.toString()).parentElement.classList.remove("numbox");
                        document.getElementById(i.toString()).parentElement.classList.add("veryclose");
                    }else if (val > .3) {
                        document.getElementById(i.toString()).parentElement.classList.remove("veryclose");
                        document.getElementById(i.toString()).parentElement.classList.remove("numbox");
                        document.getElementById(i.toString()).parentElement.classList.add("close");
                    }else {
                        document.getElementById(i.toString()).parentElement.classList.remove("close");
                        document.getElementById(i.toString()).parentElement.classList.remove("veryclose");
                        document.getElementById(i.toString()).parentElement.classList.add("numbox");
                    }

                }
            }
        }
    }

    function clear() {
        ctx.clearRect(0, 0, canv.width, canv.height);
        ctx.reset();
        array1.set(Array(784).fill(0.0));
        result.set(Array(10).fill(0.0))
        hasDrawn = false;
        for (let i = 0; i < 10; i++) {
            document.getElementById(i.toString()).textContent = result.at(i).toFixed(0.0000);
            document.getElementById(i.toString()).parentElement.classList.remove("close");
            document.getElementById(i.toString()).parentElement.classList.remove("veryclose");
            document.getElementById(i.toString()).parentElement.classList.add("numbox");
        }
    }

    clr.addEventListener("click", clear);
    setInterval(fun, 200);
    async function onDraw() {

        await ctx.fill()
        await ctx.stroke();
        chromiumIssue1092080WorkaroundOverlay.style.transform = `scaleX(${Math.random()})`
        window.requestAnimationFrame(onDraw)
        await ctx.beginPath()
    }
    window.requestAnimationFrame(onDraw)
    // Something with ctx.stroke() and window.requestAnimationFrame() will fix flickering on mobile
});
