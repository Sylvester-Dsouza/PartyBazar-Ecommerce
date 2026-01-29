import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Button, Toaster, toast, Text, IconButton, Copy, Table, Badge, Tooltip, Checkbox } from "@medusajs/ui"
import { useState, useEffect } from "react"
import { Photo, ListBullet, SquaresPlus, Trash, XMark, CheckCircleSolid } from "@medusajs/icons"
import { Link } from "react-router-dom"

// Utility to fetch
const fetcher = async (url: string, options?: RequestInit) => {
    const res = await fetch(url, options)
    if (!res.ok) throw new Error("Failed to fetch")
    return res.json()
}

const MediaPage = () => {
    const [files, setFiles] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [uploading, setUploading] = useState(false)
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('list') // Default to list view
    const [selectedFile, setSelectedFile] = useState<any | null>(null) // For Lightbox
    const [selectedKeys, setSelectedKeys] = useState<string[]>([])
    const [currentPage, setCurrentPage] = useState(0)
    const ITEMS_PER_PAGE = 12 // Increased for better grid view

    const loadFiles = async () => {
        try {
            setLoading(true)
            const data = await fetcher("/admin/media")
            setFiles(data.files || [])
        } catch (e) {
            toast.error("Failed to load files")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadFiles()
    }, [])

    const handleDelete = async (keyOrKeys: string | string[]) => {
        const isBulk = Array.isArray(keyOrKeys)
        const keys = isBulk ? keyOrKeys : [keyOrKeys]

        if (!confirm(`Are you sure you want to delete ${keys.length} file(s)?`)) return

        try {
            await fetcher("/admin/media", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(isBulk ? { keys } : { key: keys[0] })
            })
            toast.success(`${keys.length} file(s) deleted`)

            // Cleanup
            if (isBulk) {
                setSelectedKeys([])
            } else if (selectedFile?.key === keys[0]) {
                setSelectedFile(null)
            }

            loadFiles()
        } catch (e) {
            toast.error("Failed to delete file(s)")
        }
    }

    const toggleSelect = (key: string) => {
        setSelectedKeys(prev =>
            prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
        )
    }

    const toggleSelectAll = () => {
        const currentPagineKeys = paginatedFiles.map(f => f.key)
        const allSelected = currentPagineKeys.every(k => selectedKeys.includes(k))

        if (allSelected) {
            setSelectedKeys(prev => prev.filter(k => !currentPagineKeys.includes(k)))
        } else {
            setSelectedKeys(prev => Array.from(new Set([...prev, ...currentPagineKeys])))
        }
    }

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.length) return

        const formData = new FormData()
        Array.from(e.target.files).forEach((file) => {
            formData.append("files", file)
        })

        try {
            setUploading(true)
            const res = await fetch("/admin/uploads", {
                method: "POST",
                body: formData
            })

            if (!res.ok) throw new Error("Upload failed")

            toast.success("Files uploaded")
            setTimeout(loadFiles, 1000)
        } catch (e) {
            toast.error("Upload failed")
        } finally {
            setUploading(false)
        }
    }

    const formatSize = (bytes: number) => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // Pagination calculations
    const pageCount = Math.ceil(files.length / ITEMS_PER_PAGE)
    const canNextPage = currentPage < pageCount - 1
    const canPreviousPage = currentPage > 0
    const paginatedFiles = files.slice(
        currentPage * ITEMS_PER_PAGE,
        (currentPage + 1) * ITEMS_PER_PAGE
    )

    return (
        <Container className="p-0 flex flex-col min-h-screen overflow-hidden">
            <Toaster />

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b">
                <Heading level="h1">Media Library</Heading>
                <div className="flex items-center gap-2">
                    <div className="flex items-center border rounded-md overflow-hidden bg-ui-bg-base">
                        <IconButton
                            variant="transparent"
                            onClick={() => setViewMode('grid')}
                            className={`rounded-none ${viewMode === 'grid' ? 'bg-ui-bg-subtle-hover' : ''}`}
                        >
                            <SquaresPlus />
                        </IconButton>
                        <IconButton
                            variant="transparent"
                            onClick={() => setViewMode('list')}
                            className={`rounded-none ${viewMode === 'list' ? 'bg-ui-bg-subtle-hover' : ''}`}
                        >
                            <ListBullet />
                        </IconButton>
                    </div>

                    <input
                        type="file"
                        id="upload-input"
                        multiple
                        className="hidden"
                        onChange={handleUpload}
                    />
                    <Button
                        variant="secondary"
                        isLoading={uploading}
                        onClick={() => document.getElementById("upload-input")?.click()}
                    >
                        Upload Files
                    </Button>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="flex items-center justify-between px-6 py-4 border-b">
                <div className="flex items-center gap-2">
                    <Text className="text-ui-fg-subtle">Add filter</Text>
                </div>
                <div className="flex items-center gap-2">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search"
                            className="h-8 w-64 rounded-md border border-ui-border-base bg-ui-bg-field px-3 text-sm placeholder:text-ui-fg-muted focus:border-ui-border-interactive focus:outline-none"
                        />
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto">
                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <Text>Loading...</Text>
                    </div>
                ) : (
                    <>
                        {viewMode === 'grid' ? (
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 px-6 py-4">
                                {paginatedFiles.map((file) => (
                                    <div
                                        key={file.key}
                                        className={`group relative border rounded-lg bg-white overflow-hidden hover:shadow-md transition-all ${selectedKeys.includes(file.key) ? 'ring-2 ring-ui-border-interactive border-ui-border-interactive' : ''
                                            }`}
                                    >
                                        <div className="absolute top-2 left-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Checkbox
                                                checked={selectedKeys.includes(file.key)}
                                                onCheckedChange={() => toggleSelect(file.key)}
                                            />
                                        </div>
                                        {selectedKeys.includes(file.key) && (
                                            <div className="absolute top-2 left-2 z-10">
                                                <Checkbox
                                                    checked={true}
                                                    onCheckedChange={() => toggleSelect(file.key)}
                                                />
                                            </div>
                                        )}
                                        <div
                                            className="aspect-square bg-gray-100 flex items-center justify-center overflow-hidden cursor-pointer"
                                            onClick={() => setSelectedFile(file)}
                                        >
                                            {file.key.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                                                <img
                                                    src={file.url}
                                                    alt={file.key}
                                                    className="object-cover w-full h-full"
                                                    loading="lazy"
                                                />
                                            ) : (
                                                <div className="text-gray-400">
                                                    <span className="text-4xl">📄</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="p-2 border-t">
                                            <div className="text-xs truncate font-medium mb-1">{file.key.split('/').pop()}</div>
                                            <div className="flex items-center justify-between">
                                                <Text className="text-[10px] text-ui-fg-muted">{formatSize(file.size)}</Text>
                                                {file.usage?.length > 0 && (
                                                    <Tooltip content={`Used in ${file.usage.length} places`}>
                                                        <Badge size="small" color="blue" className="text-[10px] px-1 py-0 h-4">
                                                            {file.usage.length} used
                                                        </Badge>
                                                    </Tooltip>
                                                )}
                                            </div>
                                        </div>

                                        {/* Overlay Actions */}
                                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                                            <Copy content={file.url} className="bg-white/90 shadow-sm" />
                                            <Button
                                                size="small"
                                                variant="danger"
                                                className="h-6 w-6 p-0 flex items-center justify-center bg-white/90 text-red-500 shadow-sm hover:bg-red-50"
                                                onClick={() => handleDelete(file.key)}
                                            >
                                                <Trash />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <Table>
                                <Table.Header>
                                    <Table.Row>
                                        <Table.HeaderCell className="w-[32px]">
                                            <Checkbox
                                                checked={paginatedFiles.length > 0 && paginatedFiles.every(f => selectedKeys.includes(f.key))}
                                                onCheckedChange={toggleSelectAll}
                                            />
                                        </Table.HeaderCell>
                                        <Table.HeaderCell>File</Table.HeaderCell>
                                        <Table.HeaderCell>Key</Table.HeaderCell>
                                        <Table.HeaderCell>Usage</Table.HeaderCell>
                                        <Table.HeaderCell>Size</Table.HeaderCell>
                                        <Table.HeaderCell>Created</Table.HeaderCell>
                                        <Table.HeaderCell>Actions</Table.HeaderCell>
                                    </Table.Row>
                                </Table.Header>
                                <Table.Body>
                                    {paginatedFiles.map((file) => (
                                        <Table.Row
                                            key={file.key}
                                            className={`cursor-pointer ${selectedKeys.includes(file.key) ? 'bg-ui-bg-subtle' : ''}`}
                                            onClick={() => toggleSelect(file.key)}
                                        >
                                            <Table.Cell onClick={(e) => e.stopPropagation()}>
                                                <Checkbox
                                                    checked={selectedKeys.includes(file.key)}
                                                    onCheckedChange={() => toggleSelect(file.key)}
                                                />
                                            </Table.Cell>
                                            <Table.Cell>
                                                <div
                                                    className="w-10 h-10 bg-gray-100 rounded overflow-hidden flex items-center justify-center border cursor-pointer hover:opacity-80 transition-opacity"
                                                    onClick={() => setSelectedFile(file)}
                                                >
                                                    {file.key.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                                                        <img src={file.url} className="w-full h-full object-cover" />
                                                    ) : <span>📄</span>}
                                                </div>
                                            </Table.Cell>
                                            <Table.Cell className="max-w-[200px] truncate" title={file.key}>
                                                {file.key}
                                            </Table.Cell>
                                            <Table.Cell>
                                                {file.usage && file.usage.length > 0 ? (
                                                    <div className="flex flex-wrap gap-1">
                                                        {file.usage.map((u: any, idx: number) => (
                                                            <Link to={u.link} key={idx}>
                                                                <Badge size="small" color="blue" className="hover:bg-blue-100 cursor-pointer transition-colors max-w-[150px] truncate">
                                                                    {u.title}
                                                                </Badge>
                                                            </Link>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <Text className="text-ui-fg-muted italic text-xs">Unused</Text>
                                                )}
                                            </Table.Cell>
                                            <Table.Cell>{formatSize(file.size)}</Table.Cell>
                                            <Table.Cell>{new Date(file.last_modified).toLocaleDateString()}</Table.Cell>
                                            <Table.Cell>
                                                <div className="flex gap-2">
                                                    <Copy content={file.url} />
                                                    <IconButton
                                                        variant="transparent"
                                                        className="text-ui-fg-error hover:text-red-600"
                                                        onClick={() => handleDelete(file.key)}
                                                    >
                                                        <Trash />
                                                    </IconButton>
                                                </div>
                                            </Table.Cell>
                                        </Table.Row>
                                    ))}
                                </Table.Body>
                            </Table>
                        )}

                        {files.length === 0 && (
                            <div className="py-12 text-center text-ui-fg-muted">
                                No files found. Upload something to get started.
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Bulk Actions Floating Bar */}
            {selectedKeys.length > 0 && (
                <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-40 animate-in slide-in-from-bottom-4 duration-300">
                    <div className="bg-ui-bg-base border shadow-xl rounded-full px-6 py-3 flex items-center gap-6">
                        <div className="flex items-center gap-2 pr-4 border-r">
                            <div className="bg-ui-bg-interactive h-6 w-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold">
                                {selectedKeys.length}
                            </div>
                            <Text className="text-sm font-medium">Items selected</Text>
                        </div>

                        <div className="flex items-center gap-2">
                            <Button
                                variant="transparent"
                                size="small"
                                className="text-ui-fg-subtle hover:text-ui-fg-base"
                                onClick={() => setSelectedKeys([])}
                            >
                                Clear selection
                            </Button>
                            <Button
                                variant="danger"
                                size="small"
                                onClick={() => handleDelete(selectedKeys)}
                                className="flex items-center gap-2"
                            >
                                <Trash />
                                Delete Selected
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Pagination */}
            {!loading && files.length > 0 && (
                <div className="flex items-center justify-between px-6 py-4 border-t">
                    <Text className="text-ui-fg-subtle text-sm">
                        {currentPage * ITEMS_PER_PAGE + 1} — {Math.min((currentPage + 1) * ITEMS_PER_PAGE, files.length)} of {files.length} results
                    </Text>
                    <div className="flex items-center gap-2">
                        <Text className="text-ui-fg-subtle text-sm">
                            {currentPage + 1} of {pageCount} pages
                        </Text>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="transparent"
                                size="small"
                                onClick={() => setCurrentPage(currentPage - 1)}
                                disabled={!canPreviousPage}
                            >
                                Prev
                            </Button>
                            <Button
                                variant="transparent"
                                size="small"
                                onClick={() => setCurrentPage(currentPage + 1)}
                                disabled={!canNextPage}
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Lightbox / Info Modal */}
            {selectedFile && (
                <div className="fixed inset-0 z-50 flex bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
                    {/* Main Image Area */}
                    <div className="flex-1 flex items-center justify-center p-8 relative" onClick={() => setSelectedFile(null)}>
                        {selectedFile.key.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                            <img
                                src={selectedFile.url}
                                className="max-w-full max-h-full object-contain shadow-2xl rounded-sm"
                                onClick={(e) => e.stopPropagation()} // Prevent close on image click
                            />
                        ) : (
                            <div className="bg-white p-20 rounded-lg flex flex-col items-center gap-4" onClick={(e) => e.stopPropagation()}>
                                <span className="text-6xl">📄</span>
                                <Text className="text-lg font-medium">{selectedFile.key.split('/').pop()}</Text>
                            </div>
                        )}

                        {/* Close button for main area */}
                        <div className="absolute top-4 left-4">
                            <IconButton
                                variant="transparent"
                                className="text-white hover:bg-white/20"
                                onClick={() => setSelectedFile(null)}
                            >
                                <XMark />
                            </IconButton>
                        </div>
                    </div>

                    {/* Side Info Panel */}
                    <div className="w-[350px] bg-white border-l h-full p-6 flex flex-col shadow-xl overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <Heading level="h2">File Details</Heading>
                            <IconButton variant="transparent" onClick={() => setSelectedFile(null)}>
                                <XMark />
                            </IconButton>
                        </div>

                        <div className="space-y-6 flex-1">
                            <div>
                                <Text className="text-ui-fg-subtle text-xs uppercase font-medium mb-1">Filename</Text>
                                <Text className="break-all font-mono text-sm">{selectedFile.key.split('/').pop()}</Text>
                            </div>

                            <div>
                                <Text className="text-ui-fg-subtle text-xs uppercase font-medium mb-1">Size</Text>
                                <Text className="text-sm">{formatSize(selectedFile.size)}</Text>
                            </div>

                            <div>
                                <Text className="text-ui-fg-subtle text-xs uppercase font-medium mb-1">Last Modified</Text>
                                <Text className="text-sm">{new Date(selectedFile.last_modified).toLocaleString()}</Text>
                            </div>

                            <div className="pt-4 border-t">
                                <Text className="text-ui-fg-subtle text-xs uppercase font-medium mb-2">Usage ({selectedFile.usage?.length || 0})</Text>
                                {selectedFile.usage && selectedFile.usage.length > 0 ? (
                                    <div className="flex flex-col gap-2">
                                        {selectedFile.usage.map((u: any, idx: number) => (
                                            <Link to={u.link} key={idx} className="block group">
                                                <div className="flex items-center justify-between p-2 rounded-md bg-ui-bg-subtle hover:bg-ui-bg-base transition-colors border border-transparent hover:border-ui-border-base">
                                                    <div className="flex flex-col truncate">
                                                        <span className="text-xs font-medium truncate text-ui-fg-base">{u.title}</span>
                                                        <span className="text-[10px] text-ui-fg-subtle capitalize">{u.type}</span>
                                                    </div>
                                                    <div className="text-ui-fg-subtle group-hover:text-ui-fg-base">
                                                        ↗
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                ) : (
                                    <Text className="text-sm text-ui-fg-muted italic">This file is not used in any known products or categories.</Text>
                                )}
                            </div>
                        </div>

                        <div className="pt-6 border-t mt-auto flex flex-col gap-3">
                            <div className="flex gap-2">
                                <Copy content={selectedFile.url} className="w-full justify-center" />
                                <Button
                                    variant="danger"
                                    className="w-full"
                                    onClick={() => handleDelete(selectedFile.key)}
                                >
                                    Delete File
                                </Button>
                            </div>
                            <Button variant="secondary" onClick={() => window.open(selectedFile.url, '_blank')}>
                                Open Original
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </Container>
    )
}

export const config = defineRouteConfig({
    label: "Media",
    icon: Photo,
})

export default MediaPage
