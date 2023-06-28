let drawing = false;
let canv = document.getElementById('numCanvas');
let clr = document.getElementById("clear");
const ctx = canv.getContext("2d");
import Module from './nn.js'

let dotSize = canv.getBoundingClientRect().width;
let h = Math.round(20 * (canv.getBoundingClientRect().width/520));
function getH(e) {
    h =  Math.round(20 * (canv.getBoundingClientRect().width/520));
}
window.onresize = getH;


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
        y += 2
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
            array1.set([Math.min(1, val + .5 * v)], ind);
        }
    }

    function print() {
        for( let i = 0; i < 28; i++) {
            let s = "";
            for (let j = 0; j< 28; j++) {
                let ind = 28 * i + j;
                if (array1.at(ind) > .5) {
                    s += '*'
                } else if (array1.at(ind) > .2) {
                    s+= '.'
                }else {
                    s +=' '
                }
            }
            console.log(s);
        }
    }


    function recenter() {
        let right = 0;
        let left = 27;
        let top = 27;
        let bottom = 0;

        for( let i = 0; i < 28; i++) {
            for (let j = 0; j< 28; j++) {
                let ind = 28 * i + j;
                if (array1.at(ind) > 0) {
                    if (left > j) {
                        left = j;
                    }
                    if (right < j) {
                        right = j;
                    }
                    if (top > i) {
                        top = i
                    }
                    if (bottom < i) {
                        bottom = i;
                    }
                }
            }
        }
        let vert = -Math.round(13.5 - (top + bottom)/2);
        let hor = -Math.round(13.5 - (right + left)/2);
        if (vert > 0) {
            for( let i = 0; i < 28; i++) {
                for (let j = 0; j< 28; j++) {
                    let ind = 28 * i + j;
                    let shift = 28 * (i + vert) + (j);

                    if (shift < 784 && shift > 0) {
                        array1.set([array1.at(shift)], ind)
                    }
                    else {
                        array1.set([0], ind)
                    }
                }
            }
        }
        if (vert < 0) {
            for( let i = 27; i >=0; i--) {
                for (let j = 0; j< 28; j++) {
                    let ind = 28 * i + j;
                    let shift = 28 * (i + vert) + (j);

                    if (shift < 784 && shift > 0) {
                        array1.set([array1.at(shift)], ind)
                    }
                    else {
                        array1.set([0], ind)
                    }
                }
            }
        }
        if (hor > 0) {
            for( let i = 0; i < 28; i++) {
                for (let j = 0; j< 28; j++) {
                    let ind = 28 * i + j;
                    let shift = 28 * (i) + (j + hor);

                    if (j + hor < 28 && j + hor >= 0) {
                        array1.set([array1.at(shift)], ind)
                    }
                    else {
                        array1.set([0], ind)
                    }
                }
            }
        }
        if (hor < 0) {
            for( let i = 0; i < 28; i++) {
                for (let j = 27; j>=0; j--) {
                    let ind = 28 * i + j;
                    let shift = 28 * (i) + (j + hor);

                    if (j + hor < 28 && j + hor >= 0) {
                        array1.set([array1.at(shift)], ind)
                    }
                    else {
                        array1.set([0], ind)
                    }
                }
            }
        }


    }

    function addToArr(dx, dy) {
        addVal(Math.floor(dx / h), Math.floor(dy / h), 1.5);
        addVal(Math.floor(dx / h + .5), Math.floor(dy / h), 1);
        addVal(Math.floor(dx / h - .5), Math.floor(dy / h), 1);
        addVal(Math.floor(dx / h), Math.floor(dy / h + .5), 1);
        addVal(Math.floor(dx / h), Math.floor(dy / h - .5), 1);

        addVal(Math.floor(dx / h + 1), Math.floor(dy / h + 1), .8);
        addVal(Math.floor(dx / h + 1), Math.floor(dy / h - 1), .8);
        addVal(Math.floor(dx / h - 1), Math.floor(dy / h + 1), .8);
        addVal(Math.floor(dx / h - 1), Math.floor(dy / h - 1), .8);

        addVal(Math.floor(dx / h), Math.floor(dy / h + 1), .65);
        addVal(Math.floor(dx / h), Math.floor(dy / h - 1), .65);
        addVal(Math.floor(dx / h), Math.floor(dy / h + 1), .65);
        addVal(Math.floor(dx / h), Math.floor(dy / h - 1), .65);
        addVal(Math.floor(dx / h + 1), Math.floor(dy / h), .65);
        addVal(Math.floor(dx / h + 1), Math.floor(dy / h), .65);
        addVal(Math.floor(dx / h - 1), Math.floor(dy / h), .65);
        addVal(Math.floor(dx / h - 1), Math.floor(dy / h), .65);

        addVal(Math.floor(dx / h + 2), Math.floor(dy / h), .55);
        addVal(Math.floor(dx / h - 2), Math.floor(dy / h), .55);
        addVal(Math.floor(dx / h), Math.floor(dy / h + 2), .55);
        addVal(Math.floor(dx / h), Math.floor(dy / h - 2), .55);

        // addVal(Math.floor(dx / h + 2), Math.floor(dy / h + 1), .35);
        // addVal(Math.floor(dx / h + 2), Math.floor(dy / h - 1), .35);
        // addVal(Math.floor(dx / h - 2), Math.floor(dy / h + 1), .35);
        // addVal(Math.floor(dx / h - 2), Math.floor(dy / h - 1), .35);
        // addVal(Math.floor(dx / h + 1), Math.floor(dy / h + 2), .35);
        // addVal(Math.floor(dx / h + 1), Math.floor(dy / h - 2), .35);
        // addVal(Math.floor(dx / h - 1), Math.floor(dy / h + 2), .35);
        // addVal(Math.floor(dx / h - 1), Math.floor(dy / h - 2), .35);
    }

    async function draw(e) {
        if (drawing) {
            let dx = Math.round(e.clientX - e.target.getBoundingClientRect().left) - h/2;
            let dy = Math.round(e.clientY - e.target.getBoundingClientRect().top) - h/2;
            dx = Math.max(dx, 0);
            dx = Math.min(dx, 560);
            dy = Math.max(dy, 0);
            dy = Math.min(dy, 560);
            let x = dx * 520/canv.getBoundingClientRect().width;
            let y = dy * 520/canv.getBoundingClientRect().height;
            ctx.fillStyle = "black";
            canv.locked = true;
            await ctx.fillRect(x - 20, y - 20, 40, 40);
            canv.locked = false;
            //ctx.fillStyle = "black";
            //ctx.fillRect(Math.floor(dx/h)*h-h/2, Math.floor(dy/h)*h-h/2, 2 * h, 2 * h);
            hasDrawn = true;
            addToArr(Math.floor(dx / h) * h, Math.floor(dy / h) * h)
        }
    }

    async function drawMobile(e) {
        if (drawing) {
            mobile(e);
            let dx = Math.round(e.touches[0].clientX - e.target.getBoundingClientRect().left) - h/2;
            let dy = Math.round(e.touches[0].clientY - e.target.getBoundingClientRect().top) - h/2;
            dx = Math.max(dx, 0);
            dx = Math.min(dx, 560);
            dy = Math.max(dy, 0);
            dy = Math.min(dy, 560);
            let x = dx * 520/canv.getBoundingClientRect().width;
            let y = dy * 520/canv.getBoundingClientRect().height;
            ctx.fillStyle = "black";
            canv.locked = true;
            await ctx.fillRect(x - 20, y - 20, 40, 40);
            canv.locked = false;
            hasDrawn = true;
            addToArr(Math.floor(dx / h) * h, Math.floor(dy / h) * h)
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
            // print();
            recenter();
            // print()
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
                throw Error;
            }
        }
    }

    function clear() {
        ctx.clearRect(0, 0, canv.width, canv.height);
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
});
