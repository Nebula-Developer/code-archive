"use client";

import {PageStyles} from "../../components/PageContent";
import {Editor} from "@tinymce/tinymce-react";
import {forwardRef, useEffect, useRef, useState} from "react";
import React from "react";

function TinyEditor({preview, content, setContent}: {
    preview: boolean,
    content: string,
    setContent: (value: string) => void
}) {
    const editorRef = useRef<any>(null);
    const shadowHost = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!shadowHost.current) return;
        let shadow: any;
        if (!shadowHost.current.shadowRoot)
            shadow = shadowHost.current?.attachShadow({mode: "open"});
        else shadow = shadowHost.current.shadowRoot;

        if (shadow) {
            shadow.innerHTML = `
        <style>
          ${PageStyles}
        </style>

        <div class="content">
          ${content}
        </div>
      `;
        }
    });

    return (
        <div className="mt-5">
            <div className={preview ? "hidden" : ""}>
                <Editor
                    tinymceScriptSrc="/tinymce/tinymce.min.js"
                    onInit={(_evt, editor) => (editorRef.current = editor)}
                    // initialValue={initialContent}
                    onChange={(_evt, editor) => {
                        setContent(editor.getContent());
                        localStorage.setItem("content-cache", editor.getContent());
                    }}
                    licenseKey="gpl"
                    init={{
                        height: 600,
                        width: "100%",
                        min_height: 500,
                        menubar: true,
                        branding: false,
                        promotion: false,
                        resize: true,
                        setup: (editor) => {
                            editor.on("init", () => {
                                setTimeout(() => {
                                    const initialContent =
                                        localStorage.getItem("content-cache") ||
                                        "<p>Start writing here...</p>";
                                    editor.setContent(initialContent);
                                    setContent(initialContent);
                                }, 100);
                            });
                        },
                        plugins: [
                            "advlist",
                            "autolink",
                            "lists",
                            "link",
                            "image",
                            "charmap",
                            "anchor",
                            "searchreplace",
                            "visualblocks",
                            "code",
                            "fullscreen",
                            "insertdatetime",
                            "media",
                            "table",
                            "preview",
                            "help",
                            "wordcount",
                        ],
                        toolbar:
                            "undo redo | blocks | " +
                            "bold italic forecolor | alignleft aligncenter " +
                            "alignright alignjustify | bullist numlist outdent indent | " +
                            "removeformat | help",
                        content_style: PageStyles,
                    }}
                    //   ref={ref}
                />
            </div>

            <div className={`${preview ? "" : "hidden"}`}>
                <div className="border-t-[1px] pt-3 mt-3 border-gray-200">
                    <div ref={shadowHost}/>
                </div>
            </div>
        </div>
    );
}

export default TinyEditor;
