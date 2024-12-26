import { IconBulb, IconFolderCode, IconHome } from "@tabler/icons-react";
import { Path } from "../../paths";
import { NavLink, Stack } from "@mantine/core";
import { CustomNavLink } from "../base/link";

export const Navigation = () => {
  return (
      <Stack justify="space-between" h="100%">
        <div>
          <CustomNavLink to={Path.home} leftSection={<IconHome />} label="Home" />
          <NavLink leftSection={<IconBulb />} label="Quests">
            <CustomNavLink to={Path.questCategories} label="By category" />
            <CustomNavLink to={Path.questSearch} label="By search" />
          </NavLink>
        </div>
        <CustomNavLink to={Path.root} leftSection={<IconFolderCode />} label="Base.wz" />
      </Stack>
  );
};
