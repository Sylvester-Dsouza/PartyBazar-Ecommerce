"use client"

import { Editor } from "@tinymce/tinymce-react"
import { useRef } from "react"

type TinyMCEEditorProps = {
    value: string
    onChange: (content: string) => void
    height?: number
}

export default function TinyMCEEditor({ value, onChange, height = 500 }: TinyMCEEditorProps) {
    const editorRef = useRef<any>(null)

    return (
        <Editor
            apiKey={import.meta.env.TINYMCE_API_KEY}
            onInit={(evt, editor) => (editorRef.current = editor)}
            value={value}
            onEditorChange={onChange}
            init={{
                height,
                menubar: true,
                plugins: [
                    'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                    'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                    'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                ],
                toolbar: 'undo redo | blocks | ' +
                    'bold italic forecolor | alignleft aligncenter ' +
                    'alignright alignjustify | bullist numlist outdent indent | ' +
                    'removeformat | image link | code | help',
                content_style: 'body { font-family:Inter,Helvetica,Arial,sans-serif; font-size:14px }',
                branding: false,
                promotion: false,
            }}
        />
    )
}
