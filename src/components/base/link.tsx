import { Anchor, AnchorProps, Button, ButtonProps, NavLink, NavLinkProps } from "@mantine/core"
import { createLink, LinkComponent } from "@tanstack/react-router"
import React from "react"

const ButtonComponent = React.forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  return <Button ref={ref} {...props} />
})
const CreatedButtonComponent = createLink(ButtonComponent)
export const CustomButton: LinkComponent<typeof ButtonComponent> = (
  props,
) => {
  return <CreatedButtonComponent preload="intent" {...props} />
}

const NavLinkComponent = React.forwardRef<HTMLAnchorElement, NavLinkProps>((props, ref) => {
  return <NavLink ref={ref} {...props} />
})
const CreatedNavLinkComponent = createLink(NavLinkComponent)
export const CustomNavLink: LinkComponent<typeof NavLinkComponent> = (
  props,
) => {
  return <CreatedNavLinkComponent preload="intent" {...props} />
}

const AnchorComponent = React.forwardRef<HTMLAnchorElement, AnchorProps>((props, ref) => {
  return <Anchor ref={ref} {...props} />
})
const CreatedAnchorComponent = createLink(AnchorComponent)
export const CustomAnchor: LinkComponent<typeof AnchorComponent> = (
  props,
) => {
  return <CreatedAnchorComponent preload="intent" {...props} />
}
