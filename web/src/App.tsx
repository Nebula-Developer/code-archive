import { createSignal } from "solid-js";
import "./App.css";
import send from "./assets/send.svg";
import scrollArrow from "./assets/chevron-down.png";
import reset from "./assets/reset.png";
import settingsIcon from "./assets/settings.svg";
import { Message, Ollama } from "ollama";

function ChatInput(props: any) {
  return (
    <textarea
      class="w-full h-0 max-h-40 min-h-12 p-3 rounded-lg bg-gray-700 outline-gray-500 focus:outline outline-1 border-none"
      placeholder="Type a message..."
      onInput={(e) => props.setMessage(e.currentTarget.value)}
      value={props.message}
      onKeyDown={(e) => {
        if (!props.active) {
          e.preventDefault();
          return;
        }

        if (e.key === "Enter" && !e.shiftKey) {
          props.onSend();
          e.preventDefault();
        }
      }}
    ></textarea>
  );
}

function SendButton(props: any) {
  return (
    <button
      class="w-12 h-12 flex items-center justify-center bg-blue-500 rounded-lg hover:bg-blue-600 active:bg-blue-700"
      onClick={props.onClick}
    >
      <img src={send} alt="send" class="w-6 h-6" />
    </button>
  );
}

function ResetButton(props: any) {
  return (
    <button
      class="w-12 h-12 flex items-center justify-center bg-red-500 rounded-lg hover:bg-red-600 active:bg-red-700"
      onClick={props.onClick}
    >
      <img src={reset} alt="send" class="w-6 h-6 invert" />
    </button>
  );
}

function MessageElement(props: { message: Message; save?: () => void }) {
  let { message, save } = props;
  return (
    <div class="flex gap-4 w-full items-start group">
      {message.role === "assistant" ? (
        <>
          <div class="flex flex-col">
            <div
              class={
                "shadow-xl w-12 h-12 rounded-sm border border-sky-300 flex items-center justify-center" +
                ((message as any).holdContext ? " bg-sky-500" : " bg-gray-700")
              }
            >
              AI
            </div>

            {(message as any).save == undefined && (
              <button
                class="w-full mt-1 rounded-sm bg-gray-700 hover:bg-gray-600 text-xs py-1"
                onClick={save}
              >
                Save
              </button>
            )}
          </div>

          <div class="flex flex-1 flex-col">{message.content}</div>
        </>
      ) : message.role === "user" ? (
        <>
          <div class="flex-1 ml-5 h-[1px] translate-y-[12px] bg-gray-700 transition-opacity opacity-0 group-hover:opacity-100">
            <div class="h-9 w-[1px] bg-gray-700"></div>
          </div>

          <div class="text-right flex flex-col items-end">
            {message.content}
          </div>
          <div class="text-xs shadow-xl w-12 h-12 rounded-sm bg-purple-600 border border-purple-500 flex items-center justify-center">
            User
          </div>
        </>
      ) : (
        // system
        <div class="flex items-center w-full gap-3 sm:gap-4 xl:gap-8">
          <div class="h-[1px] flex-1 bg-gray-600"></div>
          <div class="flex flex-col items-center text-center whitespace-nowrap">
            {message.content}
          </div>
          <div class="h-[1px] flex-1 bg-gray-600"></div>
        </div>
      )}
    </div>
  );
}

function MessageList(props: {
  messages: Message[];
  save?: (index: number) => void;
}) {
  return (
    <div class="flex gap-4 flex-col relative">
      {props.messages.map((msg: Message, index: number) => (
        <MessageElement
          message={msg}
          save={() => props.save && props.save(index)}
        />
      ))}
    </div>
  );
}

function App() {
  const [message, setMessage] = createSignal("");
  const [messages, setMessages] = createSignal<Message[]>([]);

  const ollama = new Ollama();
  let [isChatting, setIsChatting] = createSignal(false);

  let [writingMessage, setWritingMessage] = createSignal<Message | undefined>();

  let messageContainer:
    | HTMLDivElement
    | ((el: HTMLDivElement) => void)
    | undefined;

  let [holdContext, setHoldContext] = createSignal(true);
  let [temperature, setTemperature] = createSignal(0.7);
  let [topP, setTopP] = createSignal(1);
  let [topK, setTopK] = createSignal(0);
  let [presencePenalty, setPresencePenalty] = createSignal(0);
  let [frequencyPenalty, setFrequencyPenalty] = createSignal(0);
  let [model, setModel] = createSignal("mistral");

  async function sendChatRequest() {
    setIsChatting(true);

    setMessages((messages) => [
      ...messages,
      { role: "user", content: message() },
    ]);
    setMessage("");
    scrollToBottom();

    let contextHeld = holdContext();

    var response = (await ollama
      .chat({
        model: model(),
        stream: true,
        messages: holdContext()
          ? messages()
          : [messages()[messages().length - 1]],
        options: {
          temperature: temperature(),
          top_p: topP(),
          presence_penalty: presencePenalty(),
          frequency_penalty: frequencyPenalty(),
        },
      })
      .catch((e) => {
        console.error(e);
        if (e instanceof Error) {
          if (e.message.includes("not found, try pulling it first"))
            alert(
              'Please run "ollama pull ' +
                model() +
                '" in your terminal / command prompt to install the selected model.'
            );
        }

        setIsChatting(false);
        return;
      })) as any;

    let messageContent = "";
    for await (const part of response) {
      messageContent += part.message.content;
      setWritingMessage({
        role: "assistant",
        content: messageContent,
        holdContext: contextHeld,
      });

      scrollToBottom();
    }

    setMessages((messages: any) => [...messages, writingMessage()] as any);
    setWritingMessage(undefined);

    setIsChatting(false);
    scrollToBottom();
  }

  let [scrolled, setScrolled] = createSignal(false);

  function scrollToBottom() {
    if (messageContainer instanceof HTMLDivElement) {
      messageContainer.scrollTop = messageContainer.scrollHeight;
    }
  }

  let [savedMessages, setSavedMessages] = createSignal<any[]>([]);
  try {
    setSavedMessages(JSON.parse(localStorage.getItem("savedMessages") || "[]"));
  } catch (e) {
    console.error("Failed to load saved messages from localStorage.");
    localStorage.removeItem("savedMessages");
  }

  function saveIndex(index: number) {
    let message = messages()[index];
    let priorMessage = messages()[index - 1];

    setSavedMessages((prevMessages) => {
      const updatedMessages = [...prevMessages];
      updatedMessages.push({
        ...message,
        priorMessage: {
          ...priorMessage,
          content: priorMessage.content.replace(/---.*?---/g, ""),
        },
      });
      return updatedMessages;
    });

    localStorage.setItem("savedMessages", JSON.stringify(savedMessages()));

    setMessages((prevMessages) => {
      const updatedMessages = [...prevMessages];
      (updatedMessages[index] as any) = { ...message, save: true };
      return updatedMessages;
    });
  }

  let [settings, setSettings] = createSignal(false);

  return (
    <div class="bg-gray-900 min-h-screen h-0 text-white">
      <div class="p-12 h-full w-full flex justify-center items-center">
        <div class="max-w-5xl w-full bg-gray-800 rounded-xl p-5 overflow-hidden">
          <div
            class={
              "justify-start overflow-hidden flex flex-col transition-all" +
              (settings() ? " h-52" : " h-8")
            }
          >
            <div class="w-full relative">
              <div class="flex w-full justify-between">
                <button
                  class="p-2 hover:bg-slate-600/50 w-fit rounded-lg transition-colors cursor-pointer"
                  onClick={() => setSettings(!settings())}
                >
                  <img src={settingsIcon} alt="settings" class="w-4 h-4" />
                </button>

                <div class="flex gap-2">
                  <button
                    class="text-xs p-2 bg-slate-600/20 hover:bg-slate-600/50 w-fit rounded-lg transition-colors cursor-pointer"
                    onClick={() => {
                      if (
                        confirm(
                          "Are you sure you want to clear all saved messages?"
                        )
                      ) {
                        localStorage.removeItem("savedMessages");
                        setSavedMessages([]);
                      }
                    }}
                  >
                    Clear saved messages
                  </button>

                  <button
                    class="text-xs p-2 bg-slate-600/20 hover:bg-slate-600/50 w-fit rounded-lg transition-colors cursor-pointer"
                    onClick={() => {
                      let savedMessages = JSON.parse(
                        localStorage.getItem("savedMessages") || "[]"
                      );
                      let data = JSON.stringify(savedMessages);
                      let blob = new Blob([data], { type: "application/json" });
                      let url = URL.createObjectURL(blob);
                      let a = document.createElement("a");
                      a.href = url;
                      a.download = "savedMessages.json";
                      a.click();
                    }}
                  >
                    Save to JSON ({savedMessages().length} total)
                  </button>
                </div>
              </div>

              <div class="overflow-y-scroll h-44 mt-4">
                <div class="mx-4 overflow-y-scroll pb-10 grid grid-cols-3 gap-4">
                  <SettingsCard title="Model" active={model() !== "ChatModel"}>
                    <p>Determines the model the AI uses.</p>

                    <div class="mt-2">
                      <select
                        class="w-full bg-gray-700 rounded-lg"
                        value={model()}
                        onChange={(e) => setModel(e.currentTarget.value)}
                      >
                        {/* <option value="ChatModel">Chat Model</option> */}
                        <option value="llama3.2:1b">Llama 3.2 (1b)</option>
                        <option value="llama3.2:3b">Llama 3.2 (3b)</option>
                        <option value="llama3:8b">Llama3 (8b)</option>
                        <option value="llama2-uncensored:7b">
                          Llama2 Uncencored (7b)
                        </option>
                        <option value="phi3:mini">Phi3 Mini</option>
                        <option value="qwen2.5:3b">Qwen2.5 (3b)</option>
                        <option value="qwen2.5:7b">Qwen2.5 (7b)</option>
                        <option value="nemotron-mini">Nemotron Mini</option>
                        <option value="mistral">Mistral</option>
                      </select>
                    </div>
                  </SettingsCard>

                  <SettingsCard title="Hold Context" active={holdContext()}>
                    <p>Determines whether the AI can see prior messages.</p>

                    <div class="mt-2">
                      <ToggleSwitch
                        value={holdContext()}
                        setValue={setHoldContext}
                      />
                    </div>
                  </SettingsCard>

                  <SettingsCard
                    title="Temperature"
                    active={temperature() !== 0.7}
                  >
                    <p>Determines how creative the AI is.</p>

                    <div class="mt-2 flex items-center gap-2">
                      <input
                        type="range"
                        min="0.1"
                        max="1"
                        step="0.1"
                        value={temperature()}
                        onInput={(e) =>
                          setTemperature(parseFloat(e.currentTarget.value))
                        }
                      />{" "}
                      ({temperature()})
                    </div>
                  </SettingsCard>

                  <SettingsCard
                    title="Presence Penalty"
                    active={presencePenalty() !== 0}
                  >
                    <p>Controls the likelihood of the AI repeating itself.</p>

                    <div class="mt-2 flex items-center gap-2">
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={presencePenalty()}
                        onInput={(e) =>
                          setPresencePenalty(parseFloat(e.currentTarget.value))
                        }
                      />{" "}
                      ({presencePenalty()})
                    </div>
                  </SettingsCard>

                  <SettingsCard
                    title="Frequency Penalty"
                    active={frequencyPenalty() !== 0}
                  >
                    <p>Controls the likelihood of the AI repeating itself.</p>

                    <div class="mt-2 flex items-center gap-2">
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={frequencyPenalty()}
                        onInput={(e) =>
                          setFrequencyPenalty(parseFloat(e.currentTarget.value))
                        }
                      />{" "}
                      ({frequencyPenalty()})
                    </div>
                  </SettingsCard>

                  <SettingsCard title="Top P" active={topP() !== 1}>
                    <p>
                      Determines the diversity of the AI's responses by sampling
                      from the top P (most likely) tokens.
                    </p>

                    <div class="mt-2 flex items-center gap-2">
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={topP()}
                        onInput={(e) =>
                          setTopP(parseFloat(e.currentTarget.value))
                        }
                      />{" "}
                      ({topP()})
                    </div>
                  </SettingsCard>

                  <SettingsCard title="Top K" active={topK() !== 0}>
                    <p>
                      Determines the diversity of the AI's responses by sampling
                      from the top K (most likely) tokens.
                    </p>

                    <div class="mt-2 flex items-center gap-2">
                      <input
                        type="range"
                        min="0"
                        max="50"
                        step="1"
                        value={topK()}
                        onInput={(e) =>
                          setTopK(parseInt(e.currentTarget.value))
                        }
                      />{" "}
                      ({topK()})
                    </div>
                  </SettingsCard>
                </div>
              </div>
            </div>
          </div>

          <div
            class={
              "z-10 absolute bottom-24 left-0 right-0 flex justify-center items-center transition-opacity " +
              (scrolled() ? " opacity-100" : " opacity-0 pointer-events-none")
            }
          >
            <button
              class="flex items-center justify-center w-12 h-12 rounded-full bg-gray-700 hover:bg-gray-500"
              onClick={scrollToBottom}
            >
              <img src={scrollArrow} alt="scroll down" class="w-6 h-6 invert" />
            </button>
          </div>

          <div class="relative">
            <div
              class="scroll-smooth max-h-[calc(100vh-500px)] overflow-y-scroll"
              ref={messageContainer}
              onScroll={(e) => {
                setScrolled(
                  e.currentTarget.scrollHeight -
                    e.currentTarget.scrollTop -
                    e.currentTarget.clientHeight >
                    100
                );
              }}
            >
              <div class="m-5">
                {messages().length > 0 ? (
                  <MessageList
                    messages={messages().concat(writingMessage() || [])}
                    save={saveIndex}
                  />
                ) : (
                  <MessageElement
                    message={{ role: "system", content: "No messages yet." }}
                  />
                )}
              </div>
            </div>

            <div
              class={
                "flex mt-12 mx-5 mb-5 transition-opacity space-x-2 " +
                (isChatting() && " pointer-events-none opacity-50")
              }
            >
              <ResetButton
                onClick={() => {
                  confirm("Are you sure you want to reset the chat?") &&
                    setMessages([]);
                }}
              />
              <ChatInput
                setMessage={setMessage}
                message={message()}
                onSend={sendChatRequest}
                active={!isChatting()}
              />
              <SendButton onClick={sendChatRequest} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SettingsCard(props: {
  title: string;
  children: any;
  active?: boolean;
}) {
  return (
    <div
      class={
        "h-36 bg-gray-700 rounded-lg transition-all border-2 flex flex-col" +
        (props.active ? " border-gray-400" : " border-gray-600")
      }
    >
      <div class="w-full py-1 bg-gray-600 rounded-t-[6px] flex items-center justify-center text-sm">
        {props.title}
      </div>
      <div class="m-4 text-xs flex flex-col justify-between flex-1">
        {props.children}
      </div>
    </div>
  );
}

function ToggleSwitch(props: {
  value: boolean;
  setValue: (value: boolean) => void;
}) {
  return (
    <button
      class={
        "w-12 h-6 rounded-full bg-gray-500 outline outline-1 outline-gray-400"
      }
      onClick={() => props.setValue(!props.value)}
    >
      <div
        class={
          "w-6 h-6 rounded-full bg-gray-400 transform transition-transform " +
          (props.value ? "translate-x-[100%]" : "")
        }
      ></div>
    </button>
  );
}

export default App;
