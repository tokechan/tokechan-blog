import Link from "next/link";

export default function Footer() {
    return (
        <footer>
            <p>
                <small>© 2025 Tokechan Blog</small>
                <br />
                <small>&copy; {new Date().getFullYear()} Tokechan Blog</small>            </p>
            <nav>
                <Link href="/">🏠Home</Link> | <Link href="/blog/list">💬Blog</Link>
            </nav>
        </footer>
    );
}