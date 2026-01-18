import { Metadata } from "next"
import NotFoundParty from "@modules/common/components/not-found-party"

export const metadata: Metadata = {
  title: "404",
  description: "Something went wrong",
}

export default function NotFound() {
  return <NotFoundParty />
}
