import { Link } from "react-router-dom";

export function CategoryCard({ title, image, to }) {
  return (
    <Link
      to={to}
      className="block rounded-xl overflow-hidden shadow-sm border hover:shadow-md bg-white transition"
    >
      <img src={image} alt={title} className="w-full h-36 object-cover" />
      <div className="p-4 text-center font-semibold text-gray-700">{title}</div>
    </Link>
  );
}
