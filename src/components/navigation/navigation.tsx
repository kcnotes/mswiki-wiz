import { IconBook2, IconBulb, IconFolderCode, IconHome } from "@tabler/icons-react";
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
          <NavLink leftSection={<IconBook2 />} label="Skills">
            <CustomNavLink to={Path.skillCategories} label="By category" />
            <CustomNavLink to={Path.skillSearch} label="By search" />
            <CustomNavLink to={Path.skillExport} label="Export" />
          </NavLink>
        </div>
        <CustomNavLink to={Path.root} leftSection={<IconFolderCode />} label="Base.wz" />
      </Stack>
  );
};
