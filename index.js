const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d') // quero que meus métodos sejam pra um game 2d, setando o contexto pra isso 

canvas.width = window.innerWidth // adicionei o window para sabermos que o tamanho é referenciado da janela do navegador
canvas.height = innerHeight


class Player {
	constructor(){
		this.velocity = {
			x: 0,
			y: 0
		}
		this.rotation = 0

		const image = new Image()
		image.src = './img/spaceship.png'
		image.onload = () => {
			const scale = 0.15
			this.image = image
			this.width = image.width * scale
			this.height = image.height * scale
			this.position = {
				x: canvas.width / 2 - this.width / 2,
				y: canvas.height - this.height - 20
      } // posição do player
      } // qnd a imagem carregar a gente carrega os atributos


  }

  draw() {
    // só vai desenhar se a imagem estiver carregada
  	if (this.image) {
  		c.save()
  		c.translate(
  			player.position.x + player.width / 2, 
  			player.position.y + player.height /2
  		) //setando ponto de rotação no centro do player
  		c.rotate(this.rotation)
  		c.translate(
  			-player.position.x - player.width / 2, 
  			-player.position.y - player.height /2
  			)
  		c.drawImage(
  			this.image, 
  			this.position.x, 
  			this.position.y, 
  			this.width, 
            this.height); // que espaço será preenchido pela imagem
  	}
  	c.restore()
  }

  update() {
  	if (this.image) {
  		this.draw();
  		this.position.x += this.velocity.x;
  	}
  }
}

class Projectile {
	constructor({position, velocity}){ // a posição e velocidade são setados dinamicamente baseados por onde o player está
		this.position = position
		this.velocity = velocity
		this.radius = 3
	}

	draw() {
		c.beginPath()
	c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2) // criando um círculo porque não tem circulo no canva
	c.fillStyle = 'green'
	c.fill()
	c.closePath()
}
update() {
	this.draw()
	this.position.x += this.velocity.x 
	this.position.y += this.velocity.y
}
}

class Invader {
	constructor({position}){
		this.velocity = {
			x: 0,
			y: 0
		}

		const image = new Image()
		image.src = './img/invader.png'
		image.onload = () => {
			const scale = 1
			this.image = image
			this.width = image.width * scale
			this.height = image.height * scale
			this.position = {
				x: position.x,
				y: position.y
      } // posição do player
      } // qnd a imagem carregar a gente carrega os atributos

  }

  draw() {
    // só vai desenhar se a imagem estiver carregada
  	if (this.image) {
  		c.drawImage(
  			this.image, 
  			this.position.x, 
  			this.position.y, 
  			this.width, 
            this.height); // que espaço será preenchido pela imagem
  	}
  }

  update({velocity}) {
  	if (this.image) {
  		this.draw();
  		this.position.x += velocity.x
  		this.position.y += velocity.y 
  	}
  }
}

class Grid { // pra criar linhas e colunas de invaders
	constructor() {
		this.position = {
			x:0,
			y:0
		}

		this.velocity = {
			x:3,
			y:0
		}
		this.invaders = []
		const columns = Math.floor(Math.random() * 10 + 5)
        const rows = Math.floor(Math.random() * 5 + 2) // o floor é pra ser numero inteiro, mínimo de 2 e max 7 

        this.width = columns * 30

        for (let i = 0; i < columns; i++) {
        	for (let j = 0; j < rows; j++) {
        		this.invaders.push(new Invader({
        			position:{
        				x:i * 30,
        				y: j * 30
        			}}))
        	}
        }
    }
    update(){
    	this.position.x += this.velocity.x
    	this.position.y += this.velocity.y
    	this.velocity.y = 0

    	if(this.position.x + this.width >= canvas.width || this.position.x <= 0){
    		this.velocity.x = -this.velocity.x
    		this.velocity.y = 30
    	}
    }
}

const player = new Player()
const projectiles = [] // array pra ser vários projéteis 
const grids = []
const keys = {
	a: {
		pressed: false
	},
	d: {
		pressed: false
	},
	space: {
		pressed: false
	},
} //objeto que monitora todas as teclas que quero

let frames = 0 
let randomInterval = Math.floor((Math.random() * 500) + 500)

function animate() {
	requestAnimationFrame(animate) // loop de animação pra imagem ficar carregando pq ela demora e n carrega antes do draw
	c.fillStyle = 'black'
	c.fillRect(0, 0, canvas.width, canvas.height)

	player.update();
	projectiles.forEach((projectile, index) => { // decidir o que fazer com cada projétil
		if (projectile.position.y + projectile.radius <= 0) { // se a parte de baixo do projétil estiver fora da tela
			setTimeout(() => {
				projectiles.splice(index, 1); //tirar os projéteis do jogo qnd eles sairem da tela pra não deixar o jogo lento
			}, 0); // index é a posição do projétil no array 
		} else {
			projectile.update();
		}
	});

	grids.forEach(grid => {
		grid.update()
		grid.invaders.forEach(invader => {
			invader.update({ velocity: grid.velocity })
		})
	} )

	const speed = keys.a.pressed ? -7 : keys.d.pressed ? 7 : 0;
	const rotate = keys.a.pressed ? -0.15 : keys.d.pressed ? 0.15 : 0;
	
	if (keys.a.pressed && player.position.x >= 0) {
		player.velocity.x = speed
		player.rotation = -0.15
	} else if (keys.d.pressed && player.position.x + player.width <= canvas.width){
		player.velocity.x = speed
		player.rotation = 0.15
	} 
	else {
		player.velocity.x = 0
		player.rotation = 0
	}

	if(frames % randomInterval === 0){ // fazendo novo grid spawnar a cada x frames (aleatorio)
		grids.push(new Grid())
		frames = 0
		randomInterval = Math.floor((Math.random() * 500) + 500) // muda o intervalo qnd spawna pra ele n ficar o mesmo pra sempre
	}
	frames++
}

animate()

addEventListener('keydown', ({key}) => {
	switch (key){
	case 'a': 
		//console.log('left')
		keys.a.pressed = true
		break
	case 'd': 
		//console.log('right')
		keys.d.pressed = true
		break
	case ' ': 
		//console.log('space') // vou chamar o array aqui
		projectiles.push(new Projectile({
			position: {
				x:player.position.x + player.width / 2,
				y:player.position.y + player.height /2
			},
			velocity: {
				x:0,
				y:-10
			}
		}))
		break
	}
}) // o key code é 68, descobri com o objeto do evento

addEventListener('keyup', ({key}) => {
	switch (key){
	case 'a': 
		console.log('left')
		keys.a.pressed = false
		break
	case 'd': 
		console.log('right')
		keys.d.pressed = false
		break
	case ' ': 
		console.log('space')
		break
	}
})
