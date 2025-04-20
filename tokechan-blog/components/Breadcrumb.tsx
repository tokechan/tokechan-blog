import Link from "next/link";

type Props = {
    items: {
        label: string;
        href: string;
    }[];
};

export const Breadcrumb = ({ items }: Props) => {
    return (
        <nav aria-label="breadcrumb" style={{ marginBottom: "1rem" }}>
            <ol style={{ display: "flex", gap: "0.5rem", listStyle: "none", padding: 0 }}>
                {items.map((item, index) => (
                    <li key={item.href}>
                        <Link href={item.href}>{item.label}</Link>
                        {index < items.length - 1 && " / "}
                    </li>
                ))}
            </ol>
        </nav>
    );    
}