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
  	//c.fillStyle = 'red'
  	//c.fillRect(this.position.x, this.position.y, this.width, this.height) 
  	if(this.image) // só vai desenhar se a imagem estiver carregada
  	c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height) // que espaço será preenchido pela imagem
}
}

const player = new Player()
player.draw()

function animate() {
	requestAnimationFrame(animate) // loop de animação pra imagem ficar carregando pq ela demora e n carrega antes do draw
	c.fillStyle = 'black'
	c.fillRect(0, 0, canvas.width, canvas.height)
	player.draw()
}

animate()
