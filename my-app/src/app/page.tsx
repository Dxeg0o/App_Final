"use client";
// src/pages/index.tsx
import Head from "next/head";
import TaskList from "@/components/TaskList";

export default function Home() {
  return (
    <>
      <Head>
        <title>Administrador de Tareas</title>
      </Head>
      <main style={{ padding: "2rem", fontFamily: "sans-serif" }}>
        <h1>Administrador de Tareas</h1>
        <TaskList />
      </main>
    </>
  );
}
