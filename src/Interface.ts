interface AnimalInterface {
    gerarUmSom(): void
}

class Cachorro implements AnimalInterface {
    gerarUmSom(): void {
        console.log('Latindo...');
    }

}

class Gato implements AnimalInterface {
    gerarUmSom(): void {
        console.log('Miando...');
    }
}

class Dinosauro implements AnimalInterface {

    gerarUmSom(): void {
        console.log('Rogindo...');
    }

}

function chamaAnimais(animal: AnimalInterface) {
    animal.gerarUmSom();
}

const cachorro = new Cachorro();
chamaAnimais(cachorro);

const gato = new Gato();
chamaAnimais(gato);

const dinosauro = new Dinosauro();
chamaAnimais(dinosauro);