import "./Navbar.css"

export default function Navbar() {
    return <nav className="nav">
        <a href="/" className="site-title">Explainify.AI</a>
        <ul>
            <li className="active">
                <a href="Home">Home</a>
            </li>
            <li className="active">
                <a href="Schedule">Schedule</a>
            </li>
            <li className="active">
                <a href="EduGame">EduGame</a>
            </li>
            <li className="active">
                <a href="Lernquiz">Flipped Classroom: Quiz</a>
            </li>
            <li className="active">
                <a href="faq">FAQ</a>
            </li>
            <li className="active">
                <a href="randomButton">Random Button</a>
            </li>
            <li className="active">
                <a href="about-us">Über uns</a>
            </li>
        </ul>
    </nav>

}