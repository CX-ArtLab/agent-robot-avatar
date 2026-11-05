// The original demo remains the single markup source, including its static
// loading skeleton. The skin route mounts that same stage, toolbar and chat.
export async function mountDemo(target, size = 118) {
  const response = await fetch(new URL('./index.html', import.meta.url));
  if (!response.ok) throw new Error(`Could not load demo markup: ${response.status}`);
  const source = new DOMParser().parseFromString(await response.text(), 'text/html');
  for (const id of ['canvas', 'agentOverlay']) {
    const element = source.getElementById(id);
    if (!element) throw new Error(`Missing shared demo element: ${id}`);
    (id === 'canvas' ? target : document.body).append(document.importNode(element, true));
  }
  const face = document.getElementById('face');
  face.setAttribute('size', size);
  const home = document.getElementById('home');
  home.style.width = home.style.height = `${size}px`;
}
