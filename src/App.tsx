import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";
import '@mantine/core/styles.css';
import { createTheme, MantineProvider } from '@mantine/core';

function App() {
  const [greetMsg, setGreetMsg] = useState("");
  const [name, setName] = useState("");

  async function greet() {
    const version = await invoke("greet", { path: name });
    setGreetMsg(`The version is ${name} ${version}`);
  }

  const theme = createTheme({});

  return (
    <MantineProvider theme={theme} defaultColorScheme="dark">
      <main className="container">
        <h1>MapleStory Wiki: Scrapyard</h1>
        <p>A work in progress.</p>

        <form
          className="row"
          onSubmit={(e) => {
            e.preventDefault();
            greet();
          }}
        >
          <input
            id="greet-input"
            onChange={(e) => setName(e.currentTarget.value)}
            placeholder="Enter a name..."
          />
          <button type="submit">Greet</button>
        </form>
        <p>{greetMsg}</p>
      </main>
    </MantineProvider>
  );
}

export default App;
