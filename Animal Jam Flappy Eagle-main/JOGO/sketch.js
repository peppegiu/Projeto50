var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score=0;
var ponto = 0;

var gameOver, restart;



function preload(){
  trex_running =   loadAnimation("aguia1.png", "aguia2.png");
  trex_collided = loadAnimation("eagle3.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("laranjadescolada2.png");
  
  obstacle1 = loadImage("Cactus1.png");
  obstacle23 = loadImage("Cactus2.png");
  obstacle3 = loadImage("Cactus3.png");


  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
}

function setup() {
  createCanvas(1200, 600);
  
  trex = createSprite(50,height-30,20,50);
  
  
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.08;
  
  ground = createSprite(200,height-20,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.velocityX = -(6 + 3*score/100);
  
  gameOver = createSprite(500,100);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(500,height-300);
  restart.addImage(restartImg);


  
  gameOver.scale = 0.8;
  restart.scale = 0.5;

  gameOver.visible = false;
  restart.visible = false;
  
  invisibleGround = createSprite(200,height-15,400,10);
  invisibleGround.visible = false;
  
  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;
}

function draw() {
  //trex.debug = true;
  background("cyan");
  textSize (20);
  fill ("black");
  text("Pontuação: "+ score, 390,50);
  text("Quantidade de estrelas: "+ponto, 200,75);



   
  
  if (gameState===PLAY){
    score = score + Math.round(getFrameRate()/60);
    ground.velocityX = -(6 + 3*score/100);
  
    if(touches.length > 0 || keyDown("space") && trex.y >= 159) {
      trex.velocityY = -15;
      touches  = []
    }
  
    trex.velocityY = trex.velocityY + 0.8
  
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
  
    trex.collide(invisibleGround);
    spawnClouds();
    spawnObstacles();

    if(cloudsGroup.isTouching(trex)){
     ponto= ponto + 1;
     cloudsGroup.destroyEach();
    }
  
    if(obstaclesGroup.isTouching(trex)){
        gameState = END;
    }
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    //defina a velocidade da cada objeto do jogo para 0
    ground.velocityX = 0;
    trex.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    //mude a animação do trex
    trex.changeAnimation("collided",trex_collided);
    
    //defina o tempo de vida dos objetos para que eles nunca sejam destruídos
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart)) {
      reset();
    }
  }
  
  
  drawSprites();
}

function spawnClouds() {
  //escreva o código aqui para fazer as nuvens surgirem
  if (frameCount % 60 === 0) {
    var cloud = createSprite(width+5,500,40,10);
    cloud.y = Math.round(random(50,300));
    cloud.addImage(cloudImage);
    cloud.scale = 0.05;
    cloud.velocityX = -5;
    
     //designe tempo de vida para a variável
    cloud.lifetime = 500;
    
    //ajuste a profundidade
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //adicione cada nuvem ao grupo
    cloudsGroup.add(cloud);
  }
  
}

function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(800,465,10,40);
    var obstacle2 = createSprite(800,50,10,40)
    //obstacle.debug = true;
    obstacle.velocityX = -(6 + 2*score/100);
    obstacle2.velocityX = -(6 + 2*score/100);
    //gere um obstáculo aleatório
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle23);
              break;
      case 3: obstacle2.addImage(obstacle3);
              break;
    }
    
    //designe o escalonamento e tempo de vida ao obstáculo           
    obstacle.scale = 0.2;
    obstacle.lifetime = 300;
    //adicione cada obstáculo ao grupo
    obstaclesGroup.add(obstacle);
    obstaclesGroup.add(obstacle2);
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  trex.changeAnimation("running",trex_running);
  
 
  
  score = 0;
  ponto= 0;
  
}
