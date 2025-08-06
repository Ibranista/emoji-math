"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";

import { Input } from "@/components/ui/input";
import { useGetPokemonByNameQuery } from "@/services/pokemon";

export default function ExamplePage() {
  const { data: bulbasaurData, isLoading } =
    useGetPokemonByNameQuery("bulbasaur");

  const t = useTranslations("HomePage");

  if (isLoading) return <p>Loading...</p>;

  return (
    <div>
      {bulbasaurData ? (
        <>
          <Image
            src={bulbasaurData.sprites.front_default}
            alt={bulbasaurData.name}
            width={96}
            height={96}
            priority
          />
          <h2>{t("title")}</h2>
        </>
      ) : (
        <p>No data found.</p>
      )}
      <Input type="text" placeholder="Search..." />
      <Input placeholder="Search something..." />
    </div>
  );
}
