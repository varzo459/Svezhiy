// src/components/ui/CategoryCard.jsx
import { Link } from "react-router-dom";

export function CategoryCard({
  title,
  description,
  image,
  to,
  gradient = "from-green-500 to-green-600",
}) {
  return (
    <Link
      to={to}
      className="group block rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2"
    >
      <div className="relative overflow-hidden h-64">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition duration-700 group-hover:scale-110"
        />
        <div
          className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-80 group-hover:opacity-90 transition duration-300`}
        ></div>

        <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
          <h3 className="text-2xl font-bold mb-2 group-hover:translate-y-0 translate-y-2 transition duration-300">
            {title}
          </h3>
          <p className="text-green-100 opacity-0 group-hover:opacity-100 transform group-hover:translate-y-0 translate-y-4 transition duration-500 delay-100">
            {description}
          </p>
          <div className="mt-4 flex items-center text-sm font-medium opacity-0 group-hover:opacity-100 transform group-hover:translate-y-0 translate-y-4 transition duration-500 delay-200">
            Смотреть товары
            <span className="ml-2 group-hover:translate-x-1 transition duration-300">
              →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
