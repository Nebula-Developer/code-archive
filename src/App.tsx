import { createSignal, For, Setter, Show, Signal } from "solid-js";
import { game, setGame } from "./state/gameState";
import { createStore, SetStoreFunction } from "solid-js/store";

function wrapDeepStore<T extends object>(initial: T) {
  const [state, setState] = createStore(initial);

  function createDeepProxy(target: any, path: (string | number)[] = []): any {
    return new Proxy(target, {
      get(t, prop) {
        const val = Reflect.get(t, prop);
        // Wrap nested objects
        if (val && typeof val === "object") {
          if (typeof prop === "string" || typeof prop === "number")
            return createDeepProxy(val, [...path, prop]);
        }
        return val;
      },
      set(t, prop, value) {
        console.log(`Actual ${[...path, prop].join(".")} to:`, value);
        let parts = [...path, prop] as any;
        setState(...parts, value);
        return true;
      },
    });
  }

  return createDeepProxy(state);
}

function ValueEditor(props: { value: any; onChange: (v: any) => void }) {
  const { value, onChange } = props;

  if (typeof value === "string") {
    return (
      <input
        type="text"
        value={value}
        onInput={(e) => onChange(e.currentTarget.value)}
      />
    );
  }
  if (typeof value === "number") {
    return (
      <input
        type="number"
        value={value}
        onInput={(e) => onChange(parseFloat(e.currentTarget.value))}
      />
    );
  }
  if (typeof value === "boolean") {
    return (
      <input
        type="checkbox"
        checked={value}
        onChange={(e) => onChange(e.currentTarget.checked)}
      />
    );
  }
  return <span>Unsupported type</span>;
}

// --- DeepObjectEditor Component ---
// Recursively renders keys/values, editable with ValueEditor
function DeepObjectEditor(props: { data: any }) {
  const data = props.data;

  // Check if object or primitive
  const isObject = (val: any) =>
    val !== null && typeof val === "object" && !Array.isArray(val);

  return (
    <ul style={{ "padding-left": "1em" }}>
      <For each={Object.entries(data)}>
        {([key, value]) => (
          <li>
            <strong>
              {key} ({value as any}):
            </strong>{" "}
            <Show
              when={isObject(value)}
              fallback={
                <ValueEditor
                  value={value}
                  onChange={(v) => {
                    console.log(`Setting ${key} to:`, v);
                    data[key] = v; // reactive because data is proxied
                  }}
                />
              }
            >
              <DeepObjectEditor data={value} />
            </Show>
          </li>
        )}
      </For>
    </ul>
  );
}

export default function App() {
  const [count, setCount] = createSignal(0);

  var dynamicObject = wrapDeepStore({
    dynamicProp: "Initial Value",
    nested: {
      value: "Nested Value",
      deep: {
        deeper: "Deep Value",
      },
    },
  });

  console.log(dynamicObject.dynamicProp); // Initial Value
  dynamicObject.dynamicProp = "Updated Value"; // Setting dynamicProp to: Updated Value
  console.log(dynamicObject.dynamicProp); // Initial Value

  return (
    <div>
      {/* <div class="fixed top-20 left-20 bg-red-500 rounded-xl shadow-xl p-20 text-white text-4xl">Hi</div> */}
      <h1>Vite + SolidJS + Electron</h1>
      <button onClick={() => setCount(count() + 1)}>Clicks: {count()}</button>

      <h2>Dynamic Object Editor</h2>
      <DeepObjectEditor data={dynamicObject} />
      <DeepObjectEditor data={dynamicObject} />
    </div>
  );
}
