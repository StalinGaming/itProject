window.addEventListener('load',function(){
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = 700;
canvas.height = 500;
class Gears{
    constructor(game,x,y){
        this.game = game;
        this.x = x;
        this.y = y;
        this.img = document.getElementById('Gears');
        this.frameX = Math.floor(Math.random()*3);
        this.frameY = Math.floor(Math.random()*3);
        this.ConstSize = 50;
        this.ModifySize = (Math.random() * 0.5 * 0.5).toFixed(1);
        this.actualSize = this.ConstSize * this.ModifySize;
        this.speedX = Math.random() * 6 - 3;
        this.speedY = Math.random() * 6 - 3;
        this.gravity = 0.5;
        this.markedForDestroy = false;
        this.angle = 0;
        this.va = Math.random() * 0.2 - 0.1;
    }
    update(){
        this.angle += this.va;
        this.speedY += this.gravity
        this.x -= this.speedX;
        this.y += this.speedY;
        if(this.y > this.game.height + this.size || this.x < 0 - this.size){
            this.markedForDestroy = true;
        }
    }
    draw(context){
        context.drawImage(this.img, this.frameX * this.size,this.frameY * this.size, this.size, this.size,this.x,this.y,this.size,this.size);

    }
}
class Input{
    constructor(game){
        this.game = game;
        window.addEventListener('keydown',e =>{
            if((e.key === 'ArrowUp' || e.key === 'ArrowDown') && this.game.keys.indexOf(e.key) === -1){
                this.game.keys.push(e.key);
            }
            else if (e.key === ' '){
                this.game.player.shootTop();
            }
        });
        window.addEventListener('keyup',e =>{
            if(this.game.keys.indexOf(e.key) > -1){
                this.game.keys.splice(this.game.keys.indexOf(e.key),1);
            }
        })
    }
    
}
class Projectile{
    constructor(game,x,y){
        this.game = game;
        this.x = x;
        this.y = y;
        this.height = 10;
        this.width = 10;
        this.speed = 3;
        this.markedForDestroy = false;
        this.img = document.getElementById('projectile');
    }
    update(){
        this.x += this.speed;
    }
    draw(context){
        context.drawImage(this.img,this.x,this.y,this.width,this.height);
    }
}
class Player{
    constructor(game){
    this.game = game;
    this.width = 120;
    this.height = 190;
    this.x = 20;
    this.y = 100;
    this.frameX = 0,this.MaxFrameX = 37;
    this.frameY = 0;
    this.speedY = 0.1;
    this.projectile = [];
    this.ammo = 17;
    this.image = document.getElementById('player');
    this.EnterBuff = false;
    this.startBuff = 0;
    this.endBuff =  1000;
    }
    update(Dtime){
        if(this.game.keys.includes('ArrowUp'))this.speedY = -1;
        else if(this.game.keys.includes('ArrowDown'))this.speedY = 1;
        else {
        this.speedY = 0;
        }
        this.y += this.speedY;
        if(this.y < 0)this.y = 0;
        if(this.y > canvas.height - this.height)this.y =  canvas.height - this.height;
        this.projectile.forEach(projectile =>{
            projectile.update();
        });
        if(this.EnterBuff == true){
        if(this.StartBuff > this.endBuff){
            this.startBuff = 0;
            this.EnterBuff = false;
            this.frameY = 0;
        }else{
            this.startBuff += Dtime;
            this.frameY = 1;
        }
    }
    }
    draw(context){
        context.fillStyle = 'green';
        context.strokeRect(this.x, this.y, this.width, this.height);
        this.projectile.forEach(projectile =>{
            projectile.draw(context);
        });
        
        for(let i = 0; i < 7;i++){
            context.fillStyle = 'red';
            context.fillRect(10 + 1 * i,this.y - 10,30,3);
        }
        for(let i = 0; i < this.game.playerLives;i++){
            context.fillStyle = 'green';
            context.fillRect(10 + 1 * i,this.y - 10,30,3);
        }
        context.drawImage(this.image,this.frameX * this.width,this.frameY * this.height,this.width,this.height,this.x,this.y,this.width,this.height);
        if(this.frameX < this.MaxFrameX){
            this.frameX += 1;
        }
        else{
            this.frameX = 0;
        }
    }
    shootTop(){
        if(this.game.ammo > 0){
        this.projectile.push(new Projectile(this.game,this.x + 80,this.y + 30));
        this.game.ammo += -1;
        }
    if(this.EnterBuff == true){
        this.shootTail();
        }
    }
    EnterBuff(){
        this.startBuff = 0;
        this.EnterBuff = true;
    }
    shootTail(){
        if(this.game.ammo > 0){
            this.projectile.push(new Projectile(this.game,this.x + 80,this.y + 175));
        }
    }
    
}
class Enemy{
    constructor(game){
        this.game = game;
        this.x = this.game.width;
        this.markedForDestroy = false;
        this.speed = Math.random() * -1.5 - 0.5;
        
        this.frameX = 0;
        this.frameY = 0;
        this.MaxFrameX = 37
    }
    update(){
        this.x += this.speed;
        if(this.frameX < this.MaxFrameX){
            this.frameX += 1;
        }
        else{
            this.frameX = 0;
        }
    }
    draw(context){
        context.drawImage(this.image,this.frameX * this.width,this.frameY * this.height,this.width,this.height,this.x,this.y,this.width,this.height);
        context.fillStyle = 'red';
        context.strokeRect(this.x, this.y, this.width, this.height);
    }
}
class EnemyType1 extends Enemy {
    constructor(game){
        super(game);
        this.width = 228 ;
        this.height =169 ;
        this.lives = 5;
        this.score = this.lives;
        this.y = 20 + Math.random() * (0.7 * this.game.height - this.height);
        this.image = document.getElementById("angler1");
        this.frameY = Math.floor(Math.random() * 3);
        this.giveBuff = false;
    }

}
class EnemyType2 extends Enemy {
    constructor(game){
        super(game);
        this.width = 213 ;
        this.height = 165 ;
        this.lives = 7;
        this.score = this.lives;
        this.y = 20 + Math.random() * (0.7 * this.game.height - this.height);
        this.image = document.getElementById("angler2");
        this.frameY = Math.floor(Math.random() * 2);
        this.giveBuff = false;
    }

}
class Buffer extends Enemy {
    constructor(game){
        super(game);
        this.width = 99 ;
        this.height = 95 ;
        this.lives = 7;
        this.score = this.lives;
        this.y = 20 + Math.random() * (0.7 * this.game.height - this.height);
        this.image = document.getElementById("buffer");
        this.frameY = Math.floor(Math.random() * 2);
        this.giveBuff = true;
    }
}
class Whale extends Enemy {
    constructor(game){
        super(game);
        this.width = 400 ;
        this.height = 227 ;
        this.lives = 7;
        this.spawnEnemies = true;
        this.score = this.lives;
        this.y = 20 + Math.random() * (0.7 * this.game.height - this.height);
        this.image = document.getElementById("whale");
        this.frameY = 0;
        
    }

}
class WhaleDrops extends Enemy {
    constructor(game,x,y){
        super(game);
        this.x = x;
        this.y = y;
        this.width = 115 ;
        this.height = 95 ;
        this.lives = 7;
        this.score = this.lives;
        this.y = 20 + Math.random() * (0.7 * this.game.height - this.height);
        this.image = document.getElementById("WhaleDrops");
        this.speedX = Math.random * -4.2 - 0.5;
        this.frameY = 0;
        
    }

}
class info{
    constructor(game){
        this.game = game;
        this.FontSize = 10;
        this.left0 = 'red';
        this.left6 = 'orange';
        this.left12 = 'yellow';
        this.left17 = 'green';
        this.color = this.left17;
        this.scoreColor = 'white';
    }
    draw(context){
        for(let i = 0; i < this.game.ammoMx;i++){
            context.fillStyle = 'yellow';
            context.fillRect(20 + 5 * i,3,3,10);
        }
        for(let i = 0; i < this.game.ammo;i++){
            context.fillStyle = 'green';
            context.fillRect(20 + 5 * i,3,3,10);
        }
        context.shadowOffsetX = 2;
        context.shadowOffsetY = 2;
        context.shadowColor = 'black';
        context.fillStyle = this.scoreColor;
        context.fillText("Score:" + this.game.score,250,10);
        
    }
}
class Background{
    constructor(game){
        this.game = game;
        this.img1 = document.getElementById('img1');
        this.img2 = document.getElementById('img2');
        this.img3 = document.getElementById('img3');
        this.img4 = document.getElementById('img4');
        this.layer1 = new Layer(this.game,this.img1,5);
        this.layer2 = new Layer(this.game,this.img2,5);
        this.layer3 = new Layer(this.game,this.img3,5);
        this.layer4 = new Layer(this.game,this.img4,5);
        this.layers = [this.layer1,this.layer2,this.layer3,this.layer4];
    }
    update(){
        this.layers.forEach(layer => layer.update());
    }
    draw(context){
        this.layers.forEach(layer => layer.draw(context));
    }
}
class Layer{
    constructor(game,image,speedModifier){
        this.game = game;
        this.image = image;
        this.speedModifier = speedModifier;
        this.width = 1768;
        this.height = 500;
        this.x = 0;
        this.y = 0;
    }
    update(){
        if(this.x <= -this.width){
            this.x = 0;
        }
        else{
            this.x -= this.game.speed * this.speedModifier;
        }  
    }
    draw(context){
        context.drawImage(this.image, this.x, this.y);
        context.drawImage(this.image, this.x + this.width, this.y);
    }
}
class Game{
    constructor(width, height){
        this.width = width;
        this.height = height;
        this.Background = new Background(this);
        this.player = new Player(this);
        this.input = new Input(this);
        this.info = new info(this);
        this.keys = [];
        this.projectile = [];
        this.enemies = [];
        this.Gears = [];
        this.ammo = 17;
        this.ammoMx = 17;
        this.RefreshAmmo = 0;
        this.refresh = 1500;
        this.spawnEnemyTimer = 0;
        this.spawnEnemyTimerEnd = 1500;
        this.refreshCheck = 0;
        this.score = 0;
        this.playerLives = 7;
        this.speed = 1;
        this.buff = false;
        this.DevMode = true;
    }
    update(Dtime){
        console.log(this.player.EnterBuff == false);
        console.log(this.player.frameY);
        this.Background.update();
        this.player.update(Dtime);
        if(this.RefreshAmmo > this.refresh){
            if(this.ammo < this.ammoMx){
            this.ammo++;
            this.RefreshAmmo = 0;
            if(this.refreshCheck > 10){
                this.ammo += 5;
                if(this.ammoMx < this.ammo){
                    this.ammo = this.ammoMx;
                }
                this.refreshCheck += -10;
            }
        }    
        }else{
            this.RefreshAmmo += Dtime;
        }
        this.enemies.forEach(Enemy =>{
            Enemy.update(); 
            if(this.checkForCollision(this.player,Enemy)){
                Enemy.markedForDestroy = true;
                this.playerLives--;
                this.Gears.push(new Gears(this, Enemy.x + Enemy.width / 2,this.y + Enemy.height / 2 ));
            }
            this.player.projectile.forEach(projectile =>{
                if(this.checkForCollision(projectile,Enemy)){
                if(this.player.giveBuff == true){
                    this.buff = true;
                }
                if(this.buff == true){
                    this.player.EnterBuff = true;
                    this.player.EnterBuff();
                    this.buff = false;
                }
                if(this.spawnEnemies == true){
                    this.enemies.push(new WhaleDrops(this,Enemy.x,Enemy.y)); 
                }
                projectile.markedForDestroy = true;
                this.refreshCheck++;
                Enemy.lives--;
                if(Enemy.lives < 1){
                    Enemy.markedForDestroy = true;
                    this.score += Enemy.score;
                    for(let i = 0;i < 3;i++){
                        this.Gears.push(new Gears(this, Enemy.x + Enemy.width / 2,this.y + Enemy.height / 2 ));
                    }
                }
                }
            });
        });
        this.Gears.forEach(gears => gears.update());
        if(this.spawnEnemyTimer > this.spawnEnemyTimerEnd){
            this.addEnemy();
            this.spawnEnemyTimerEnd = 0;
        }else{
            this.spawnEnemyTimer += Dtime;
        }
        this.enemies = this.enemies.filter(Enemy => !Enemy.markedForDestroy);
        this.projectile = this.projectile.filter(Projectile => !Projectile.markedForDestroy);
        this.Gears.filter(gear => !gear.markedForDestroy);
    }
    draw(context){
        this.Background.draw(context);
        this.player.draw(context);
        this.info.draw(context);
        this.Gears.forEach(gear => gear.draw(context))
        this.enemies.forEach(Enemy =>{
            Enemy.draw(context); 
        });
    }
    addEnemy(){
        var picker = Math.floor(Math.random() * 100);
        if(picker == 2)
        this.enemies.push(new EnemyType1(this));
        if(picker == 1)
        this.enemies.push(new EnemyType2(this));
        var luckyPicker = Math.floor(Math.random() * 10);
        if(luckyPicker == 1){
            this.enemies.push(new Buffer(this));
        }
        var WhalePicker = Math.floor(Math.random() * 10);
        if(WhalePicker == 1){
            this.enemies.push(new Whale(this));
        }
    }
    checkForCollision(r1,r2){
        return((r1.x < r2.x + r2.width) && (r1.y < r2.y + r2.height ) && (r1.x + r1.width> r2.x) && (r1.y + r1.height> r2.y) && (r1.height + r1.y > r2.y))
    }
}
const game = new Game(canvas.width,canvas.height);
const player = new Player(game);
let lastTime = 0;
function animate(timeStamp){
    const Dtime = timeStamp - lastTime;
    lastTime = timeStamp;
    ctx.clearRect(0,0,canvas.width,canvas.height);
    game.update(Dtime);
    game.draw(ctx);
    requestAnimationFrame(animate);
}
animate(0);
});
