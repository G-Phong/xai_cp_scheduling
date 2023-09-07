export default function Navbar() {
    return <nav className="nav">
        <a href="/" className="site-title">Explainify.AI</a>
        <ul>
            <li className="active">
                <a href="#">Startseite</a>
            </li>
            <li className="active">
                <a href="#">EduGame</a>
            </li>
            <li className="active">
                <a href="#">Lern-Quiz</a>
            </li>
            <li className="active">
                <a href="#">FAQ</a>
            </li>
            <li className="active">
                <a href="#">Über uns</a>
            </li>
        </ul>
    </nav>

}