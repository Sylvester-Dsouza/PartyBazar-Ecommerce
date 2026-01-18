import { Metadata } from "next"
import BlogListTemplate from "@modules/blog/templates/blog-list"

export const metadata: Metadata = {
    title: "Blog",
    description: "Read our latest articles and updates.",
}

type Params = {
    params: Promise<{
        countryCode: string
    }>
}

export default async function BlogPage(props: Params) {
    const params = await props.params

    return <BlogListTemplate countryCode={params.countryCode} />
}
