"use client"

import { Popover, PopoverPanel, Transition } from "@headlessui/react"
import { ArrowRightMini, XMark } from "@medusajs/icons"
import { Text, clx, useToggleState } from "@medusajs/ui"
import { Fragment } from "react"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CountrySelect from "../country-select"
import { HttpTypes } from "@medusajs/types"
import { MenuItem } from "@lib/data/menu"

// Fallback menu items for mobile
const FALLBACK_SIDE_MENU_ITEMS = [
  { id: "1", title: "Home", url: "/" },
  { id: "2", title: "Store", url: "/store" },
  { id: "3", title: "Account", url: "/account" },
  { id: "4", title: "Cart", url: "/cart" },
]

type SideMenuProps = {
  regions: HttpTypes.StoreRegion[] | null
  menuItems?: MenuItem[]
}

const SideMenu = ({ regions, menuItems }: SideMenuProps) => {
  const toggleState = useToggleState()

  // Use provided menu items or fallback
  const items = menuItems && menuItems.length > 0
    ? menuItems
    : FALLBACK_SIDE_MENU_ITEMS

  return (
    <div className="h-full">
      <div className="flex items-center h-full">
        <Popover className="h-full flex">
          {({ open, close }) => (
            <>
              <div className="relative flex h-full">
                <Popover.Button
                  data-testid="nav-menu-button"
                  className="relative h-full flex items-center transition-all ease-out duration-200 focus:outline-none hover:text-ui-fg-base"
                >
                  Menu
                </Popover.Button>
              </div>

              {open && (
                <div
                  className="fixed inset-0 z-[50] bg-black/0 pointer-events-auto"
                  onClick={close}
                  data-testid="side-menu-backdrop"
                />
              )}

              <Transition
                show={open}
                as={Fragment}
                enter="transition ease-out duration-150"
                enterFrom="opacity-0"
                enterTo="opacity-100 backdrop-blur-2xl"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 backdrop-blur-2xl"
                leaveTo="opacity-0"
              >
                <PopoverPanel className="flex flex-col absolute w-full pr-4 sm:pr-0 sm:w-1/3 2xl:w-1/4 sm:min-w-min h-[calc(100vh-1rem)] z-[51] inset-x-0 text-sm text-ui-fg-on-color m-2 backdrop-blur-2xl">
                  <div
                    data-testid="nav-menu-popup"
                    className="flex flex-col h-full bg-[rgba(3,7,18,0.5)] rounded-rounded justify-between p-6"
                  >
                    <div className="flex justify-end" id="xmark">
                      <button data-testid="close-menu-button" onClick={close}>
                        <XMark />
                      </button>
                    </div>
                    <ul className="flex flex-col gap-6 items-start justify-start">
                      {items.map((item: any) => (
                        <li key={item.id}>
                          <LocalizedClientLink
                            href={item.url}
                            className="text-3xl leading-10 hover:text-ui-fg-disabled flex items-center gap-2"
                            onClick={close}
                            data-testid={`${item.title.toLowerCase().replace(/\s+/g, '-')}-link`}
                            target={(item.open_in_new_tab === true || String(item.open_in_new_tab) === "true") ? "_blank" : undefined}
                            rel={(item.open_in_new_tab === true || String(item.open_in_new_tab) === "true") ? "noopener noreferrer" : undefined}
                          >
                            <span className="relative">
                              {item.title}
                              {item.highlight && item.highlight_text && (
                                <span className="absolute -top-1 -right-4 translate-x-1/2 text-[10px] font-bold uppercase bg-red-500 text-white px-2 py-0.5 rounded-full shadow-sm border border-white leading-none">
                                  {item.highlight_text}
                                </span>
                              )}
                            </span>
                          </LocalizedClientLink>
                        </li>
                      ))}
                    </ul>
                    <div className="flex flex-col gap-y-6">
                      <div
                        className="flex justify-between"
                        onMouseEnter={toggleState.open}
                        onMouseLeave={toggleState.close}
                      >
                        {regions && (
                          <CountrySelect
                            toggleState={toggleState}
                            regions={regions}
                          />
                        )}
                        <ArrowRightMini
                          className={clx(
                            "transition-transform duration-150",
                            toggleState.state ? "-rotate-90" : ""
                          )}
                        />
                      </div>
                      <Text className="flex justify-between txt-compact-small">
                        © {new Date().getFullYear()} Party Bazaar Store. All rights
                        reserved.
                      </Text>
                    </div>
                  </div>
                </PopoverPanel>
              </Transition>
            </>
          )}
        </Popover>
      </div>
    </div>
  )
}

export default SideMenu

