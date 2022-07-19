const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d');
canvas.width = 1920;
canvas.height = 1080;



const collisionMap = []
for (let i = 0; i < collision.length; i += 70) {
    collisionMap.push(collision.slice(i, 70 + i))

}



const boundaries = []
var offset = {
    
    x: Math.floor(Math.random() * -820) - 750 ,
    y: Math.floor(Math.random() * -680) - 600 ,
    
    
}





collisionMap.forEach((row , i) => {
    row.forEach((symbol, j) => {
        if (symbol === 1025)
        boundaries.push(new Boundary({position: {
            x: j * Boundary.width + offset.x,
            y: i * Boundary.height + offset.y
        }
        
        }))
    })
})


if(offset == collisionMap){
    offset.x = false;
    offset.y = false;
}


const image = new Image();
image.src = './image/town.png';

const image1 = new Image();
image1.src = './image/b.png';

const foregroundImage = new Image();
foregroundImage.src = './image/foreground1.png';

const playerDownImage = new Image();
playerDownImage.src ='./image/characterd5.png';

const playerRightImage = new Image();
playerRightImage.src ='./image/characterwalkright06.png';

const playerLeftImage = new Image();
playerLeftImage.src ='./image/characterwalkleft.png';

const playerUpImage = new Image();
playerUpImage.src ='./image/characterd5.png';

const playerImage = new Image();
playerImage.src ='./image/character01.png';


const player = new Sprite({
    position: {
        x: canvas.width / 2 - 560 / 22 /2,
        y: canvas.height / 2 - 180 /2,
    },
    image: playerDownImage,
    frames: {
        max: 22
    },
    sprites:{
        right: playerRightImage,
        down: playerDownImage,
        left: playerLeftImage,
        up: playerDownImage
    
    }
})
console.log(player)




const background = new Sprite({ 
    position: {
        x: offset.x,
        y: offset.y
    },
    image: image
    
    

})
const foreground = new Sprite({ 
    position: {
        x: offset.x,
        y: offset.y
    },
    image: foregroundImage

})

const keys ={
    w: {
        pressed: false
    },
    a: {
        pressed: false
    },
    s: {
        pressed: false
    },
    d: {
        pressed: false
    }
}



const movables = [background, ...boundaries, foreground]
function rectangularCollision({rectangle1, rectangle2}){
    return((rectangle1.position.x + rectangle1.width >= rectangle2.position.x && 
        rectangle1.position.x <=  rectangle2.position.x + rectangle2.width &&
        rectangle1.position.y <=  rectangle2.position.y + rectangle2.height &&
        rectangle1.position.y + rectangle1.height >= rectangle2.position.y) )
    
}
function animate(){
    window.requestAnimationFrame(animate)
    background.draw();
    boundaries.forEach((Boundary) => {
        Boundary.draw()

        
        
    })

    
    
    player.draw()
    foreground.draw()
    


    let moving = true
    
       player.moving = false

   if (keys.w.pressed && lastKey === 'w') {
    player.moving = true
    player.image = player.sprites.up
    for (let i = 0; i < boundaries.length; i++){
        
        const Boundary = boundaries[i]
        if (rectangularCollision({
            rectangle1: player,
            rectangle2: {...Boundary, position:{
                x:Boundary.position.x ,
                y:Boundary.position.y + 2
            }}
        })
       ) {
        
        moving = false
        break;
       }
    }
    if(moving)
    movables.forEach((movable) => {
    movable.position.y += 3
   }) }
   
   else if (keys.a.pressed && lastKey === 'a') {
    player.moving = true
    player.image = player.sprites.left
    for (let i = 0; i < boundaries.length; i++){
        
        const Boundary = boundaries[i]
        if (rectangularCollision({
            rectangle1: player,
            rectangle2: {...Boundary, position:{
                x:Boundary.position.x + 2,
                y:Boundary.position.y 
            }}
        })
       ) {
        
        moving = false
        break;
       }
    }
    if(moving)
    movables.forEach((movable) => {
        movable.position.x += 3
   })}
        else if (keys.s.pressed && lastKey === 's') {
            player.moving = true
               player.image = player.sprites.down
            for (let i = 0; i < boundaries.length; i++){
                
                const Boundary = boundaries[i]
                if (rectangularCollision({
                    rectangle1: player,
                    rectangle2: {...Boundary, position:{
                        x:Boundary.position.x ,
                        y:Boundary.position.y - 2
                    }}
                })
               ) {
                
                moving = false
                break;
               }
            }
            if(moving)
            
           
            movables.forEach((movable) => {
            movable.position.y -= 3 
        })}
        else if (keys.d.pressed && lastKey === 'd') {
            player.moving = true
                player.image = player.sprites.right
            for (let i = 0; i < boundaries.length; i++){
                
                const Boundary = boundaries[i]
                if (rectangularCollision({
                    rectangle1: player,
                    rectangle2: {...Boundary, position: {
                        x:Boundary.position.x - 2,
                        y:Boundary.position.y 
                    }}
                })
               ) {
                
                moving = false
                
                break;
               }
            }
            if(moving)
            movables.forEach((movable) => {
            movable.position.x -= 3
        

   })}
}
animate();

let lastKey ='';
window.addEventListener('keydown', (e) => {
    console.log(e.key);
    switch (e.key) {
        case 'w':
        keys.w.pressed = true
        lastKey ='w'
            break;
        case 'a':
            keys.a.pressed = true
            lastKey ='a'
            break;
        case 's':
            keys.s.pressed = true
            lastKey ='s'
            break;
        case 'd':
            keys.d.pressed = true
            lastKey ='d'
            break;
    }
    
})

window.addEventListener('keyup', (e) => {
    console.log(e.key);
    switch (e.key) {
        case 'w':
        keys.w.pressed = false
            break;
        case 'a':
            keys.a.pressed = false
            break;
        case 's':
            keys.s.pressed = false
            break;
        case 'd':
            keys.d.pressed = false
            break;
    }
    
})

function start() {
    background.draw()
    if(start){
        moving = false;
    }
}

function startGame() {
    let startDiv = document.getElementById("start");
    let gamecanvas = document.getElementById("canvas");
    
    startDiv.style.display = "none";
    gamecanvas.style.display = "block";
}
    start()

    
    
    
