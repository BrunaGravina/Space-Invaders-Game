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

const player = new Player()
const projectiles = [] // array pra ser vários projéteis 
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

function animate() {
	requestAnimationFrame(animate) // loop de animação pra imagem ficar carregando pq ela demora e n carrega antes do draw
	c.fillStyle = 'black'
	c.fillRect(0, 0, canvas.width, canvas.height)
	player.update();
	projectiles.forEach((projectile, index) => {
		if (projectile.position.y + projectile.radius <= 0) {
			setTimeout(() => {
				projectiles.splice(index, 1);
			}, 0);
		} else {
			projectile.update();
		}
	});

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
