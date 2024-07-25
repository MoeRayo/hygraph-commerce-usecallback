import { useState, useEffect, useCallback } from "react";
import { GraphQLClient, gql } from "graphql-request";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import "./App.css";

const endpoint = new GraphQLClient(
	import.meta.env.VITE_HYGRAPH_HIGH_PERFORMANCE_ENDPOINT
);

const GET_PRODUCTS_QUERY = gql`
	query GetProducts {
		products {
			images {
				id
				url
			}
			name
			price
			id
		}
	}
`;

function App() {
	const [products, setProducts] = useState([]);
	const [favorites, setFavorites] = useState({});

	useEffect(() => {
		const fetchProducts = async () => {
			try {
				const data = await endpoint.request(GET_PRODUCTS_QUERY);
				setProducts(data.products);
			} catch (error) {
				console.error("Error fetching products:", error);
			}
		};

		fetchProducts();
	}, []);

	const handleFavorite = useCallback((id) => {
		setFavorites((prevFavorites) => ({
			...prevFavorites,
			[id]: !prevFavorites[id],
		}));
	}, []);

	return (
		<div className="App container mx-auto p-4">
			<h1 className="text-2xl font-bold mb-4">Product List</h1>
			<ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
				{products.map((product) => (
					<li
						key={product.id}
						className="border rounded-lg p-4 shadow-md bg-gray-50">
						<img
							src={product.images[0].url}
							alt={product.name}
							className="w-full object-cover mb-4 rounded bg-white"
						/>
						<h2 className="text-lg font-semibold mb-2">{product.name}</h2>
						<p className="text-gray-600 mb-2">
							Price: ${(product.price / 100).toFixed(2)}
						</p>
						<button
							className="text-xl mr-2 heart-button"
							onClick={() => handleFavorite(product.id)}>
							<FontAwesomeIcon
								icon={faHeart}
								style={{ color: favorites[product.id] ? "red" : "grey" }}
							/>
						</button>
					</li>
				))}
			</ul>
		</div>
	);
}

export default App;
