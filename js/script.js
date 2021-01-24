function iniciarMenuMobile(){
    const botao = document.querySelector('[data-menu="botao"]');
    const menu = document.querySelector('[data-menu="itens"]');
    const html = document.documentElement;
    const eventos = ['click', 'touchstart'];

    function controleEventos(funcaoAdicionar, funcaoRemover) {
        eventos.forEach((evento) => {
            botao.removeEventListener(evento, funcaoRemover);
            botao.addEventListener(evento, funcaoAdicionar);
        })
    }

    function removerItens(){
        menu.classList.remove('ativar-botao');
        html.removeEventListener('click', acionarClickFora);
        html.removeAttribute('data-fora');
        setTimeout(() => {controleEventos(controlarMenu, removerItens);}, 300);
        
    }
    
    function acionarClickFora(event){
        if(!(menu.contains(event.target) || event.target === botao)){
            console.log('aqui aqui aqui');
            removerItens();
        }
    }

    function controlarMenu(event){
            menu.classList.add('ativar-botao');
            if(!html.hasAttribute('data-fora')){
                setTimeout(() => {
                    html.addEventListener('click', acionarClickFora);
                    controleEventos(removerItens, controlarMenu)
                }, 300);
                html.setAttribute('data-fora', '');
            }
    }

    eventos.forEach((evento) => botao.addEventListener(evento, controlarMenu));
}

function iniciarMudarFilme(){
    const listaEpisodios = document.querySelectorAll('.episodios li');
    const listaSinopse = document.querySelectorAll('.info-filme > section');
    const listaImagens = document.querySelectorAll('.imagem-filme > img');

    function adicionarClasse(index, ...args) {
        args.forEach((elemento) => elemento[index].classList.add('ativo'));
    }

    function removerClasse(...args) {
        args.forEach((elemento) => elemento.forEach(item => item.classList.remove('ativo')));
    }
    
    function mudarFilme(){
        const index = Array.from(listaEpisodios).indexOf(this);
        removerClasse(listaSinopse, listaImagens, listaEpisodios);
        adicionarClasse(index, listaSinopse, listaImagens, listaEpisodios);
    }
 
    listaEpisodios.forEach((episodio) => {
        episodio.addEventListener('click', mudarFilme);
    });

    adicionarClasse(0, listaSinopse, listaImagens, listaEpisodios);
}

function iniciarScrollSuave(){
    const linksMenu = document.querySelectorAll('a[href^="#"]');

    function scrollSuave(event){
        event.preventDefault();
        const secao = document.querySelector(this.getAttribute('href'));
        secao.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
        });
    }

    linksMenu.forEach(link => link.addEventListener('click', scrollSuave));
}

function iniciarMudarPersonagem(){
    let indexs;
    let itensSlide;
    const container = document.querySelector('[data-container]');
    const slide = document.querySelector('[data-personagens]');
    const setaAnterior = document.querySelector('[data-seta="anterior"]');
    const setaProximo = document.querySelector('[data-seta="proximo"]');

    function configSlide() {
        itensSlide = [...slide.children].map((item) => {
            return {
                elemento: item,
                posicao: (container.offsetWidth > 300)? -(item.offsetLeft - 20) : -item.offsetLeft
            } 
        });  
    }

    function incremento(){
        let cont = 0;
        let tamanhoTotal = 0;
        itensSlide.forEach((objeto) => {
            tamanhoTotal += objeto.elemento.offsetWidth;
            if(container.offsetWidth >= tamanhoTotal) {
                cont += 1;
            }
        });
        return cont;
    }

    function mapearIndex(index){
        const ultimoItem  = itensSlide.length;
        const i = incremento();
        indexs = {
            anterior: index ? index - i : undefined,
            atual: index,
            proximo: (index + i >= ultimoItem) ? undefined : index + i
        }
    }

    function moverSlide(mover) {
        slide.style.transform = `translate3d(${mover}px, 0, 0)`;
    }

    function mudarSlide(index){
        const item = itensSlide[index];
        moverSlide(item.posicao);
        mapearIndex(index);
    }

    function anterior(){
        if(indexs.anterior !== undefined) mudarSlide(indexs.anterior);
    }

    function proximo(){
        if(indexs.proximo !== undefined) mudarSlide(indexs.proximo);
    }

    function onResize(){
        setTimeout( () =>{
            configSlide();
            const grupoIndex = [];
            let index = 0;
            if(container.offsetWidth > 300){
                for(let i = 0; i < itensSlide.length; i+=3){
                    grupoIndex.push(i);
                }

                for(let cont = indexs.atual;!(grupoIndex.includes(cont));){
                    cont-=1;
                    index = cont;
                }  
            }
            else{
                index = indexs.atual;
            }
            mudarSlide(index);
        }, 1000);
    }

    setaAnterior.addEventListener('click', anterior);
    setaProximo.addEventListener('click', proximo);
    window.addEventListener('resize', onResize);
    configSlide();
    mapearIndex(0);
    mudarSlide(0);
}

function acionarMetodos(){
    iniciarMenuMobile();
    iniciarMudarFilme();
    iniciarScrollSuave();
    iniciarMudarPersonagem();
}

window.addEventListener('load', acionarMetodos)