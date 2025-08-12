"use client";

import { useGetPokemonByNameQuery } from "@/services/pokemon";

export default function Home() {
  const { data, error, isLoading } = useGetPokemonByNameQuery("bulbasaur");
  console.log("my data-->", data);
  return <h1>pimary</h1>;
}
