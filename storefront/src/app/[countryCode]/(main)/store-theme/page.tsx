import { Metadata } from "next"
import { 
  Button, 
  Heading, 
  Text, 
  Label, 
  Checkbox, 
  RadioGroup, 
  Badge,
  Table,
  Container,
  clx,
} from "@medusajs/ui"
import { 
  ArrowUpRightMini, 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash,
  ChevronUpDown,
  Spinner,
  Github,
  Gift,
  Sparkles,
  Heart
} from "@medusajs/icons"

export const metadata: Metadata = {
  title: "Store Theme - Party Bazaar",
  description: "Complete UI component showcase for Party Bazaar design system",
}

export default function StoreThemePage() {
  return (
    <div className="content-container py-12">
      {/* Page Header */}
      <div className="text-center mb-16">
        <h1 className="party-heading-xl mb-4">
          Party Bazaar Design System
        </h1>
        <Text className="text-grey-50 text-lg max-w-2xl mx-auto">
          Fun & playful UI components with sky blue and light pink theme.
          Bold headings, rounded buttons, and clean typography.
        </Text>
      </div>

      {/* ============================================ */}
      {/* SECTION: Party Theme Colors */}
      {/* ============================================ */}
      <section className="mb-16">
        <h2 className="party-heading-md mb-6 pb-2 border-b border-gray-200">
          🎨 Party Theme Colors
        </h2>
        
        <div className="space-y-8">
          {/* Party Pink */}
          <div>
            <Text className="text-base-semi mb-4">Party Pink (Primary)</Text>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
              <div className="text-center">
                <div className="h-16 w-full bg-party-pink-50 rounded-xl border"></div>
                <Text className="text-xsmall-regular mt-2">pink-50</Text>
              </div>
              <div className="text-center">
                <div className="h-16 w-full bg-party-pink-100 rounded-xl"></div>
                <Text className="text-xsmall-regular mt-2">pink-100</Text>
              </div>
              <div className="text-center">
                <div className="h-16 w-full bg-party-pink-200 rounded-xl"></div>
                <Text className="text-xsmall-regular mt-2">pink-200</Text>
              </div>
              <div className="text-center">
                <div className="h-16 w-full bg-party-pink-300 rounded-xl"></div>
                <Text className="text-xsmall-regular mt-2">pink-300</Text>
              </div>
              <div className="text-center">
                <div className="h-16 w-full bg-party-pink-500 rounded-xl"></div>
                <Text className="text-xsmall-regular mt-2">pink-500</Text>
              </div>
              <div className="text-center">
                <div className="h-16 w-full bg-party-pink-600 rounded-xl"></div>
                <Text className="text-xsmall-regular mt-2">pink-600</Text>
              </div>
            </div>
          </div>

          {/* Party Sky Blue */}
          <div>
            <Text className="text-base-semi mb-4">Party Sky Blue (Secondary)</Text>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
              <div className="text-center">
                <div className="h-16 w-full bg-party-sky-50 rounded-xl border"></div>
                <Text className="text-xsmall-regular mt-2">sky-50</Text>
              </div>
              <div className="text-center">
                <div className="h-16 w-full bg-party-sky-100 rounded-xl"></div>
                <Text className="text-xsmall-regular mt-2">sky-100</Text>
              </div>
              <div className="text-center">
                <div className="h-16 w-full bg-party-sky-200 rounded-xl"></div>
                <Text className="text-xsmall-regular mt-2">sky-200</Text>
              </div>
              <div className="text-center">
                <div className="h-16 w-full bg-party-sky-300 rounded-xl"></div>
                <Text className="text-xsmall-regular mt-2">sky-300</Text>
              </div>
              <div className="text-center">
                <div className="h-16 w-full bg-party-sky-500 rounded-xl"></div>
                <Text className="text-xsmall-regular mt-2">sky-500</Text>
              </div>
              <div className="text-center">
                <div className="h-16 w-full bg-party-sky-600 rounded-xl"></div>
                <Text className="text-xsmall-regular mt-2">sky-600</Text>
              </div>
            </div>
          </div>

          {/* Accent Colors */}
          <div>
            <Text className="text-base-semi mb-4">Accent & Background Colors</Text>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-party-cream rounded-xl border">
                <Text className="text-small-semi">party-cream</Text>
                <Text className="text-xsmall-regular text-grey-50">Warm background</Text>
              </div>
              <div className="p-4 bg-party-peach rounded-xl border">
                <Text className="text-small-semi">party-peach</Text>
                <Text className="text-xsmall-regular text-grey-50">Soft accent</Text>
              </div>
              <div className="p-4 bg-party-mint rounded-xl border">
                <Text className="text-small-semi">party-mint</Text>
                <Text className="text-xsmall-regular text-grey-50">Fresh accent</Text>
              </div>
              <div className="p-4 bg-party-lavender rounded-xl border">
                <Text className="text-small-semi">party-lavender</Text>
                <Text className="text-xsmall-regular text-grey-50">Soft purple</Text>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* SECTION: Typography */}
      {/* ============================================ */}
      <section className="mb-16">
        <h2 className="party-heading-md mb-6 pb-2 border-b border-gray-200">
          ✨ Typography
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Party Headings - Bold & Clean */}
          <div className="space-y-6">
            <Text className="text-base-semi mb-2 text-party-pink-500">Party Headings (Bold, Tight Tracking)</Text>
            <h1 className="party-heading-xl">Make Your Party Unforgettable</h1>
            <h2 className="party-heading-lg">Let&apos;s Get the Party Started</h2>
            <h3 className="party-heading-md">Featured Products</h3>
            <h4 className="party-heading-sm">Shop by Category</h4>
          </div>

          {/* Body Text */}
          <div className="space-y-4">
            <Text className="text-base-semi mb-2 text-party-sky-500">Body Text Styles</Text>
            <p className="text-lg text-grey-70">Large body text - 18px for important descriptions</p>
            <p className="text-base text-grey-60">Regular body text - 16px for standard content</p>
            <p className="text-sm text-grey-50">Small text - 14px for secondary information</p>
            <p className="text-xs text-grey-40">Extra small - 12px for captions and labels</p>
          </div>
        </div>

        {/* Font Weight Examples */}
        <div className="mt-8 p-6 bg-party-cream rounded-2xl">
          <Text className="text-base-semi mb-4">Font Weights (Inter)</Text>
          <div className="space-y-2">
            <p className="text-xl font-normal">Font Normal (400) - Regular text</p>
            <p className="text-xl font-medium">Font Medium (500) - Slightly emphasized</p>
            <p className="text-xl font-semibold">Font Semibold (600) - Important text</p>
            <p className="text-xl font-bold">Font Bold (700) - Headings & CTAs</p>
            <p className="text-xl font-extrabold">Font Extrabold (800) - Maximum impact</p>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* SECTION: Buttons */}
      {/* ============================================ */}
      <section className="mb-16">
        <h2 className="party-heading-md mb-6 pb-2 border-b border-gray-200">
          🎈 Buttons
        </h2>
        
        <div className="space-y-8">
          {/* Party Theme Buttons - Primary */}
          <div className="p-6 bg-party-pink-50 rounded-2xl">
            <Text className="text-base-semi mb-4 text-party-pink-600">Party Buttons - Pink (Primary)</Text>
            <div className="flex flex-wrap gap-4">
              <button className="party-btn-primary">
                Primary Button
              </button>
              <button className="party-btn-outline">
                Outline Button
              </button>
              <button className="party-btn-soft">
                Soft Button
              </button>
            </div>
          </div>

          {/* Party Theme Buttons - Secondary */}
          <div className="p-6 bg-party-sky-50 rounded-2xl">
            <Text className="text-base-semi mb-4 text-party-sky-600">Party Buttons - Sky Blue (Secondary)</Text>
            <div className="flex flex-wrap gap-4">
              <button className="party-btn-secondary">
                Secondary Button
              </button>
              <button className="party-btn-outline-sky">
                Outline Sky
              </button>
              <button className="party-btn-soft-sky">
                Soft Sky
              </button>
            </div>
          </div>

          {/* Buttons with Icons */}
          <div>
            <Text className="text-base-semi mb-4">Buttons with Icons</Text>
            <div className="flex flex-wrap gap-4">
              <button className="party-btn-primary inline-flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
              </button>
              <button className="party-btn-secondary inline-flex items-center gap-2">
                <Heart className="w-5 h-5" />
                Add to Wishlist
              </button>
              <button className="party-btn-outline inline-flex items-center gap-2">
                <Gift className="w-5 h-5" />
                Gift Wrap
              </button>
            </div>
          </div>

          {/* Category Pills (like reference image) */}
          <div className="p-6 bg-party-cream rounded-2xl">
            <Text className="text-base-semi mb-4">Category Pills (Like Reference)</Text>
            <div className="flex flex-wrap gap-3">
              <button className="party-pill-active">
                🎂 Birthday Party
              </button>
              <button className="party-pill">
                🍼 Baby Shower
              </button>
              <button className="party-pill">
                🎓 Graduation
              </button>
              <button className="party-pill">
                💍 Anniversary
              </button>
              <button className="party-pill">
                🎭 Prom Night
              </button>
            </div>
          </div>

          {/* Medusa UI Buttons (for reference) */}
          <div>
            <Text className="text-base-semi mb-4 text-grey-50">Medusa UI Buttons (Original)</Text>
            <div className="flex flex-wrap gap-4">
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="transparent">Transparent</Button>
              <Button variant="danger">Danger</Button>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* SECTION: Form Elements */}
      {/* ============================================ */}
      <section className="mb-16">
        <Heading level="h2" className="text-2xl-semi mb-6 pb-2 border-b border-gray-200">
          Form Elements
        </Heading>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Input Component (from modules/common/components/input) */}
          <div className="space-y-6">
            <Text className="text-base-semi">Input Fields (Custom Component)</Text>
            
            {/* Standard Input */}
            <div className="flex flex-col w-full">
              <Label className="mb-2 txt-compact-medium-plus">Standard Input</Label>
              <div className="flex relative z-0 w-full txt-compact-medium">
                <input
                  type="text"
                  placeholder=" "
                  className="pt-4 pb-1 block w-full h-11 px-4 mt-0 bg-ui-bg-field border rounded-md appearance-none focus:outline-none focus:ring-0 focus:shadow-borders-interactive-with-active border-ui-border-base hover:bg-ui-bg-field-hover"
                />
                <label className="flex items-center justify-center mx-3 px-1 transition-all absolute duration-300 top-3 -z-1 origin-0 text-ui-fg-subtle">
                  Email Address
                </label>
              </div>
            </div>

            {/* Required Input */}
            <div className="flex flex-col w-full">
              <div className="flex relative z-0 w-full txt-compact-medium">
                <input
                  type="text"
                  placeholder=" "
                  required
                  className="pt-4 pb-1 block w-full h-11 px-4 mt-0 bg-ui-bg-field border rounded-md appearance-none focus:outline-none focus:ring-0 focus:shadow-borders-interactive-with-active border-ui-border-base hover:bg-ui-bg-field-hover"
                />
                <label className="flex items-center justify-center mx-3 px-1 transition-all absolute duration-300 top-3 -z-1 origin-0 text-ui-fg-subtle">
                  Full Name<span className="text-rose-500">*</span>
                </label>
              </div>
            </div>
          </div>

          {/* Native Select (from modules/common/components/native-select) */}
          <div className="space-y-6">
            <Text className="text-base-semi">Select / Dropdown (Custom Component)</Text>
            
            <div>
              <div className="relative flex items-center text-base-regular border border-ui-border-base bg-ui-bg-subtle rounded-md hover:bg-ui-bg-field-hover">
                <select className="appearance-none flex-1 bg-transparent border-none px-4 py-2.5 transition-colors duration-150 outline-none">
                  <option disabled value="">Select Country...</option>
                  <option value="in">India</option>
                  <option value="us">United States</option>
                  <option value="uk">United Kingdom</option>
                </select>
                <span className="absolute right-4 inset-y-0 flex items-center pointer-events-none">
                  <ChevronUpDown />
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Checkbox and Radio */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          {/* Checkbox */}
          <div className="space-y-4">
            <Text className="text-base-semi">Checkbox (Medusa UI)</Text>
            <div className="flex items-center space-x-2">
              <Checkbox id="terms" />
              <Label htmlFor="terms" size="base">Accept terms and conditions</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="newsletter" defaultChecked />
              <Label htmlFor="newsletter" size="base">Subscribe to newsletter</Label>
            </div>
          </div>

          {/* Radio (Custom Component) */}
          <div className="space-y-4">
            <Text className="text-base-semi">Radio Button (Custom Component)</Text>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  role="radio"
                  data-state="checked"
                  className="group relative flex h-5 w-5 items-center justify-center outline-none"
                >
                  <div className="shadow-borders-base bg-ui-bg-interactive shadow-borders-interactive flex h-[14px] w-[14px] items-center justify-center rounded-full">
                    <div className="bg-ui-bg-base shadow-details-contrast-on-bg-interactive rounded-full h-1.5 w-1.5"></div>
                  </div>
                </button>
                <Label>Selected Option</Label>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  role="radio"
                  data-state="unchecked"
                  className="group relative flex h-5 w-5 items-center justify-center outline-none"
                >
                  <div className="shadow-borders-base group-hover:shadow-borders-strong-with-shadow bg-ui-bg-base flex h-[14px] w-[14px] items-center justify-center rounded-full"></div>
                </button>
                <Label>Unselected Option</Label>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* SECTION: Badges */}
      {/* ============================================ */}
      <section className="mb-16">
        <Heading level="h2" className="text-2xl-semi mb-6 pb-2 border-b border-gray-200">
          Badges
        </Heading>
        
        <div className="space-y-4">
          <Text className="text-base-semi mb-4">Badge Colors (Medusa UI)</Text>
          <div className="flex flex-wrap gap-3">
            <Badge>Default</Badge>
            <Badge color="green">Green / Success</Badge>
            <Badge color="red">Red / Error</Badge>
            <Badge color="blue">Blue / Info</Badge>
            <Badge color="orange">Orange / Warning</Badge>
            <Badge color="purple">Purple</Badge>
            <Badge color="grey">Grey</Badge>
          </div>
        </div>

        <div className="mt-6">
          <Text className="text-base-semi mb-4">Badge Sizes</Text>
          <div className="flex flex-wrap items-center gap-3">
            <Badge size="small">Small</Badge>
            <Badge size="base">Base</Badge>
            <Badge size="large">Large</Badge>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* SECTION: Cards */}
      {/* ============================================ */}
      <section className="mb-16">
        <h2 className="party-heading-md mb-6 pb-2 border-b border-gray-200">
          🎁 Cards
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Party Card - Pink Border */}
          <div className="party-card-pink p-6">
            <Text className="text-base-semi mb-2">Party Card (Pink)</Text>
            <Text className="text-small-regular text-grey-50">
              Rounded corners with pink border accent
            </Text>
          </div>

          {/* Party Card - Sky Border */}
          <div className="party-card-sky p-6">
            <Text className="text-base-semi mb-2">Party Card (Sky)</Text>
            <Text className="text-small-regular text-grey-50">
              Rounded corners with sky blue border
            </Text>
          </div>

          {/* Party Card - Default */}
          <div className="party-card p-6">
            <Text className="text-base-semi mb-2">Party Card (Default)</Text>
            <Text className="text-small-regular text-grey-50">
              Clean white with subtle shadow
            </Text>
          </div>
        </div>

        {/* Product Card Example */}
        <div className="mt-8">
          <Text className="text-base-semi mb-4">Product Card Example</Text>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="party-card group cursor-pointer overflow-hidden">
              <div className="aspect-square bg-party-pink-100 rounded-t-2xl flex items-center justify-center">
                <span className="text-4xl">🎈</span>
              </div>
              <div className="p-4">
                <Text className="font-semibold text-grey-80">Balloon Pack</Text>
                <Text className="text-party-pink-500 font-bold">₹199</Text>
              </div>
            </div>
            <div className="party-card group cursor-pointer overflow-hidden">
              <div className="aspect-square bg-party-sky-100 rounded-t-2xl flex items-center justify-center">
                <span className="text-4xl">🎂</span>
              </div>
              <div className="p-4">
                <Text className="font-semibold text-grey-80">Cake Topper</Text>
                <Text className="text-party-sky-500 font-bold">₹149</Text>
              </div>
            </div>
            <div className="party-card group cursor-pointer overflow-hidden">
              <div className="aspect-square bg-party-peach rounded-t-2xl flex items-center justify-center">
                <span className="text-4xl">🎉</span>
              </div>
              <div className="p-4">
                <Text className="font-semibold text-grey-80">Party Poppers</Text>
                <Text className="text-party-pink-500 font-bold">₹99</Text>
              </div>
            </div>
            <div className="party-card group cursor-pointer overflow-hidden">
              <div className="aspect-square bg-party-mint rounded-t-2xl flex items-center justify-center">
                <span className="text-4xl">🎁</span>
              </div>
              <div className="p-4">
                <Text className="font-semibold text-grey-80">Gift Box Set</Text>
                <Text className="text-party-sky-500 font-bold">₹299</Text>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* SECTION: Table */}
      {/* ============================================ */}
      <section className="mb-16">
        <Heading level="h2" className="text-2xl-semi mb-6 pb-2 border-b border-gray-200">
          Table
        </Heading>
        
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Product</Table.HeaderCell>
              <Table.HeaderCell>Price</Table.HeaderCell>
              <Table.HeaderCell>Quantity</Table.HeaderCell>
              <Table.HeaderCell className="text-right">Total</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            <Table.Row>
              <Table.Cell>Party Supplies Kit</Table.Cell>
              <Table.Cell>₹499.00</Table.Cell>
              <Table.Cell>2</Table.Cell>
              <Table.Cell className="text-right">₹998.00</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Balloon Pack (50pcs)</Table.Cell>
              <Table.Cell>₹199.00</Table.Cell>
              <Table.Cell>3</Table.Cell>
              <Table.Cell className="text-right">₹597.00</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Party Banner</Table.Cell>
              <Table.Cell>₹149.00</Table.Cell>
              <Table.Cell>1</Table.Cell>
              <Table.Cell className="text-right">₹149.00</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
      </section>

      {/* ============================================ */}
      {/* SECTION: Divider */}
      {/* ============================================ */}
      <section className="mb-16">
        <Heading level="h2" className="text-2xl-semi mb-6 pb-2 border-b border-gray-200">
          Divider
        </Heading>
        
        <div className="space-y-4">
          <Text>Content above divider</Text>
          <div className="h-px w-full border-b border-gray-200 mt-1" />
          <Text>Content below divider</Text>
        </div>
      </section>

      {/* ============================================ */}
      {/* SECTION: Loading States */}
      {/* ============================================ */}
      <section className="mb-16">
        <Heading level="h2" className="text-2xl-semi mb-6 pb-2 border-b border-gray-200">
          Loading States
        </Heading>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Spinner */}
          <div>
            <Text className="text-base-semi mb-4">Spinner Icon</Text>
            <div className="flex items-center gap-4">
              <Spinner className="animate-spin" />
              <Text className="text-ui-fg-subtle">Loading...</Text>
            </div>
          </div>

          {/* Skeleton */}
          <div>
            <Text className="text-base-semi mb-4">Skeleton Loading</Text>
            <div className="animate-pulse space-y-3">
              <div className="h-4 bg-gray-100 rounded w-full"></div>
              <div className="h-4 bg-gray-100 rounded w-3/4"></div>
              <div className="h-4 bg-gray-100 rounded w-1/2"></div>
            </div>
          </div>

          {/* Skeleton Button */}
          <div>
            <Text className="text-base-semi mb-4">Skeleton Button</Text>
            <div className="w-full min-h-[50px] px-5 py-[10px] bg-gray-100 rounded animate-pulse"></div>
          </div>

          {/* Skeleton Product Preview */}
          <div>
            <Text className="text-base-semi mb-4">Skeleton Product Card</Text>
            <div className="animate-pulse">
              <Container className="aspect-[9/16] w-full bg-gray-100 bg-ui-bg-subtle" />
              <div className="flex justify-between text-base-regular mt-2">
                <div className="w-2/5 h-6 bg-gray-100 rounded"></div>
                <div className="w-1/5 h-6 bg-gray-100 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* SECTION: Interactive Link */}
      {/* ============================================ */}
      <section className="mb-16">
        <Heading level="h2" className="text-2xl-semi mb-6 pb-2 border-b border-gray-200">
          Interactive Link
        </Heading>
        
        <div className="flex gap-x-1 items-center group cursor-pointer">
          <Text className="text-ui-fg-interactive">View all products</Text>
          <ArrowUpRightMini
            className="group-hover:rotate-45 ease-in-out duration-150"
            color="var(--fg-interactive)"
          />
        </div>
      </section>

      {/* ============================================ */}
      {/* SECTION: Border Radius */}
      {/* ============================================ */}
      <section className="mb-16">
        <Heading level="h2" className="text-2xl-semi mb-6 pb-2 border-b border-gray-200">
          Border Radius (from tailwind.config.js)
        </Heading>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="text-center">
            <div className="h-16 w-full bg-ui-bg-subtle border border-ui-border-base rounded-none"></div>
            <Text className="text-xsmall-regular mt-2">rounded-none (0px)</Text>
          </div>
          <div className="text-center">
            <div className="h-16 w-full bg-ui-bg-subtle border border-ui-border-base rounded-soft"></div>
            <Text className="text-xsmall-regular mt-2">rounded-soft (2px)</Text>
          </div>
          <div className="text-center">
            <div className="h-16 w-full bg-ui-bg-subtle border border-ui-border-base rounded-base"></div>
            <Text className="text-xsmall-regular mt-2">rounded-base (4px)</Text>
          </div>
          <div className="text-center">
            <div className="h-16 w-full bg-ui-bg-subtle border border-ui-border-base rounded-rounded"></div>
            <Text className="text-xsmall-regular mt-2">rounded-rounded (8px)</Text>
          </div>
          <div className="text-center">
            <div className="h-16 w-full bg-ui-bg-subtle border border-ui-border-base rounded-large"></div>
            <Text className="text-xsmall-regular mt-2">rounded-large (16px)</Text>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* SECTION: Breakpoints */}
      {/* ============================================ */}
      <section className="mb-16">
        <Heading level="h2" className="text-2xl-semi mb-6 pb-2 border-b border-gray-200">
          Responsive Breakpoints
        </Heading>
        
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Breakpoint</Table.HeaderCell>
              <Table.HeaderCell>Min Width</Table.HeaderCell>
              <Table.HeaderCell>CSS Class</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            <Table.Row>
              <Table.Cell>2xsmall</Table.Cell>
              <Table.Cell>320px</Table.Cell>
              <Table.Cell><code className="text-small-regular bg-gray-100 px-2 py-1 rounded">2xsmall:</code></Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>xsmall</Table.Cell>
              <Table.Cell>512px</Table.Cell>
              <Table.Cell><code className="text-small-regular bg-gray-100 px-2 py-1 rounded">xsmall:</code></Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>small</Table.Cell>
              <Table.Cell>1024px</Table.Cell>
              <Table.Cell><code className="text-small-regular bg-gray-100 px-2 py-1 rounded">small:</code></Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>medium</Table.Cell>
              <Table.Cell>1280px</Table.Cell>
              <Table.Cell><code className="text-small-regular bg-gray-100 px-2 py-1 rounded">medium:</code></Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>large</Table.Cell>
              <Table.Cell>1440px</Table.Cell>
              <Table.Cell><code className="text-small-regular bg-gray-100 px-2 py-1 rounded">large:</code></Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>xlarge</Table.Cell>
              <Table.Cell>1680px</Table.Cell>
              <Table.Cell><code className="text-small-regular bg-gray-100 px-2 py-1 rounded">xlarge:</code></Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>2xlarge</Table.Cell>
              <Table.Cell>1920px</Table.Cell>
              <Table.Cell><code className="text-small-regular bg-gray-100 px-2 py-1 rounded">2xlarge:</code></Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
      </section>

      {/* ============================================ */}
      {/* SECTION: Icons */}
      {/* ============================================ */}
      <section className="mb-16">
        <Heading level="h2" className="text-2xl-semi mb-6 pb-2 border-b border-gray-200">
          Icons (Medusa Icons)
        </Heading>
        
        <div className="grid grid-cols-4 md:grid-cols-8 gap-6">
          <div className="flex flex-col items-center gap-2">
            <ShoppingCart className="w-6 h-6" />
            <Text className="text-xsmall-regular">ShoppingCart</Text>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Plus className="w-6 h-6" />
            <Text className="text-xsmall-regular">Plus</Text>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Minus className="w-6 h-6" />
            <Text className="text-xsmall-regular">Minus</Text>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Trash className="w-6 h-6" />
            <Text className="text-xsmall-regular">Trash</Text>
          </div>
          <div className="flex flex-col items-center gap-2">
            <ArrowUpRightMini className="w-6 h-6" />
            <Text className="text-xsmall-regular">ArrowUpRight</Text>
          </div>
          <div className="flex flex-col items-center gap-2">
            <ChevronUpDown className="w-6 h-6" />
            <Text className="text-xsmall-regular">ChevronUpDown</Text>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Spinner className="w-6 h-6" />
            <Text className="text-xsmall-regular">Spinner</Text>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Github className="w-6 h-6" />
            <Text className="text-xsmall-regular">Github</Text>
          </div>
        </div>
      </section>

      {/* Footer */}
      <div className="border-t border-party-pink-200 pt-8 text-center bg-gradient-to-r from-party-pink-50 to-party-sky-50 -mx-6 px-6 pb-8 mt-16 rounded-t-3xl">
        <h3 className="party-heading-sm mb-2">🎉 Party Bazaar Design System</h3>
        <Text className="text-grey-50 text-base-regular">
          Fun & playful UI with sky blue and light pink theme
        </Text>
        <Text className="text-grey-40 text-small-regular mt-2">
          Built with Medusa UI • Inter Font • Rounded Components
        </Text>
      </div>
    </div>
  )
}
