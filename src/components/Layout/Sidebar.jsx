import { useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';


import { Nav } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComments, faGaugeHigh, faStar } from '@fortawesome/free-solid-svg-icons';
import reactLogo from '../../assets/react.svg'

const Sidebar = () => {
    const favoritePost = useSelector(state => state.favorites.favoritePosts);
    const location = useLocation();

    const getNavLinkClass = (path) => {
        if (path === '/') {
            return location.pathname === path ? 'nav-link bg-activeLinkBg text-activeLinkText' : 'nav-link';
        }
        return location.pathname.startsWith(path) ? 'nav-link bg-activeLinkBg text-activeLinkText' : 'nav-link';
    }

    return (
        <div className="sidebar bg-light">
            <Nav className="flex-column p-3">
                <Link to="/" className="logo-link text-center mb-4 text-decoration-none">
                    <img
                        src={reactLogo} // Replace with your logo path
                        alt="Logo"
                        className="img-fluid"
                        style={{ maxWidth: '50px' }}
                    />
                    <div className="small text-muted">BETA version</div>
                </Link>
                <Nav.Link as={Link} to="/" className={getNavLinkClass('/')}>
                    <FontAwesomeIcon icon={faGaugeHigh} />
                    <span className='ms-2'>Dashboard</span>
                </Nav.Link>
                <Nav.Link as={Link} to="/favorites" className={getNavLinkClass('/favorites')}>
                    <FontAwesomeIcon icon={faStar} />
                    <span className='ms-2 me-2'>Favorites
                        <span className="sidebar-badge ms-1">{favoritePost.length}</span>
                    </span>
                </Nav.Link>
                <Nav.Link as={Link} to="/post" className={getNavLinkClass('/post')}>
                    <FontAwesomeIcon icon={faComments} />
                    <span className='ms-2'>Posts</span>
                </Nav.Link>
            </Nav>
        </div>
    );
}

export default Sidebar;
