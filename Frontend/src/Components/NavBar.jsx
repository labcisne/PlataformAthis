import navImage from '../img/navImage.png'
import sponsers from '../img/tudo.png'


function NavBar(){

    return (
        <div className='navBar'>
            <div>
                <img src={navImage} alt="Imagem da logo" width="200px" />
            </div>
            <div>
                <img src={sponsers} alt="Imagem da logo" width="200px" />
            </div>
        </div>
    )
}

export default NavBar;