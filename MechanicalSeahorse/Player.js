export class Player{
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
    this.endBBuff =  5000;
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
        if(this.EnterBuff > this.endBuff){
            this.EnterBuff = 0;
            this.EnterBuff = false;
            this.frameY = 0;
        }else{
            this.EnterBuff += Dtime;
            this.frameY = 1;
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