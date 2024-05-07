"use server";

import { SEARCH } from "../../../../utils/movie_urls";
import PreFetchMovieInfo from "./cacher";
import Image from "next/image";
import Link from "next/link";
import styles from "../styles/search.module.css";

const SearchResults = async (title) => {
	const data = await get_search_results(title);
	PreFetchMovieInfo(data);
	return (
		<div className={styles.MovieSearchResultsContainer}>
			{data &&
				data.results &&
				data.results.map((item, index) => {
					if (item.poster_path) {
						return (
							<Link
								href={`/movies/${item.id}`}
								key={index}
								style={{
									backgroundImage: `url(https://sup-proxy.zephex0-f6c.workers.dev/api-content?url=https://image.tmdb.org/t/p/original${item.backdrop_path})`,
									backgroundRepeat: "no-repeat",
									backgroundSize: "cover",
									textDecoration: "none",
									color: "white",
									borderRadius: "0.5rem",
									overflow: "hidden",
								}}
								className={styles.MovieResultsPrev}
							>
								<section className={styles.MovieEntry}>
									<p>{item.title || item.original_title}</p>
									<Image
										src={`https://sup-proxy.zephex0-f6c.workers.dev/api-content?url=https://image.tmdb.org/t/p/original${item.poster_path}`}
										width={150}
										height={230}
										alt="Movie Poster"
										priority
									/>
								</section>
							</Link>
						);
					}
				})}
		</div>
	);
};

const get_search_results = async (title) => {
	const res = await fetch(SEARCH + title, { next: { revalidate: 21600 } });
	const data = await res.json();
	return data;
};

export default SearchResults;