/* eslint-disable */
import React, { useState, useEffect, useCallback } from "react";
import { NavLink, useLocation } from "react-router-dom";
// chakra imports
import { Box, Flex, HStack, Text, useColorModeValue, Collapse } from "@chakra-ui/react";
import { IoIosArrowDown, IoIosArrowForward } from "react-icons/io";

export function SidebarLinks(props) {
  //   Chakra color mode
  let location = useLocation();
  let activeColor = useColorModeValue("gray.700", "white");
  let inactiveColor = useColorModeValue(
    "secondaryGray.600",
    "secondaryGray.600"
  );
  let activeIcon = useColorModeValue("brand.500", "white");
  let textColor = useColorModeValue("secondaryGray.500", "white");
  let brandColor = useColorModeValue("brand.500", "brand.400");

  const { routes } = props;

  // verifies if routeName is the one active (in browser input)
  const activeRoute = (routeName) => {
    return location.pathname.includes(routeName);
  };

  // State to manage dropdown visibility
  const [openDropdowns, setOpenDropdowns] = useState({});

  // Close all dropdowns
  const closeAllDropdowns = useCallback(() => {
    const newOpenDropdowns = {};
    routes.forEach((_, index) => {
      newOpenDropdowns[index] = false;
    });
    setOpenDropdowns(newOpenDropdowns);
  }, [routes]);

  // Toggle dropdown visibility
  const toggleDropdown = (index) => {
    setOpenDropdowns(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  // Close all dropdowns except the one containing the active route
  useEffect(() => {
    const newOpenDropdowns = {};
    const checkRouteActive = (route, index) => {
      if (route.children) {
        const hasActiveChild = route.children.some(child => 
          activeRoute((child.layout || '') + child.path)
        );
        newOpenDropdowns[index] = hasActiveChild;
        return hasActiveChild;
      }
      return false;
    };

    routes.forEach((route, index) => {
      checkRouteActive(route, index);
    });

    setOpenDropdowns(newOpenDropdowns);
  }, [location, routes]);

  // Handle clicks outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = () => {
      // Close all dropdowns except those with active children
      const newOpenDropdowns = {};
      routes.forEach((route, index) => {
        if (route.children) {
          const hasActiveChild = route.children.some(child => 
            activeRoute((child.layout || '') + child.path)
          );
          newOpenDropdowns[index] = hasActiveChild;
        } else {
          newOpenDropdowns[index] = false;
        }
      });
      setOpenDropdowns(newOpenDropdowns);
    };

    // Add event listener for clicks
    document.addEventListener('click', handleClickOutside);
    
    return () => {
      // Clean up event listener
      document.removeEventListener('click', handleClickOutside);
    };
  }, [location, routes]);

  // this function creates the links from the secondary accordions (for example auth -> sign-in -> default)
  const createLinks = (routes) => {
    return routes.map((route, index) => {
      if (route.category) {
        return (
          <Fragment key={index}>
            <Text
              fontSize={"md"}
              color={activeColor}
              fontWeight='bold'
              mx='auto'
              ps={{
                sm: "10px",
                xl: "16px",
              }}
              pt='18px'
              pb='12px'
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              {route.name}
            </Text>
            {createLinks(route.items)}
          </Fragment>
        );
      } else if (route.children && route.children.length > 0) {
        // Handle parent items with children (dropdowns)
        const isOpen = openDropdowns[index] || false;
        const hasActiveChild = route.children.some(child => 
          activeRoute((child.layout || '') + child.path)
        );
        
        // Prevent closing the dropdown when clicking on it
        const handleDropdownClick = (e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleDropdown(index);
        };
        
        return (
          <Box key={index}>
            <HStack
              spacing="26px"
              py='5px'
              ps='10px'
              onClick={handleDropdownClick}
              cursor="pointer"
              alignItems="center"
            >
              <Flex w='100%' alignItems='center'>
                {route.icon && (
                  <Box
                    color={hasActiveChild ? activeIcon : textColor}
                    me='18px'>
                    {route.icon}
                  </Box>
                )}
                <Text
                  me='auto'
                  color={hasActiveChild ? activeColor : textColor}
                  fontWeight={hasActiveChild ? "bold" : "normal"}>
                  {route.name}
                </Text>
                <Box mr='20px'>
                  {isOpen ? (
                    <IoIosArrowDown color={textColor} />
                  ) : (
                    <IoIosArrowForward color={textColor} />
                  )}
                </Box>
              </Flex>
            </HStack>
            <Collapse in={isOpen} animateOpacity>
              <Box pl='30px'>
                {createLinks(route.children)}
              </Box>
            </Collapse>
          </Box>
        );
      } else if (
        (route.layout === "/admin" ||
        route.layout === "/auth" ||
        route.layout === "/rtl") &&
        route.path
      ) {
        // Handle regular menu items
        const handleRegularItemClick = (e) => {
          e.stopPropagation();
          // Close all dropdowns when clicking on a regular item
          closeAllDropdowns();
        };
        
        return (
          <NavLink 
            key={index} 
            to={route.layout + route.path}
            onClick={handleRegularItemClick}
            style={{ display: 'block' }}
          >
            <Box>
              {route.icon ? (
                <Box>
                  <HStack
                    spacing={
                      activeRoute(route.path.toLowerCase()) ? "22px" : "26px"
                    }
                    py='5px'
                    ps='10px'>
                    <Flex w='100%' alignItems='center' justifyContent='center'>
                      <Box
                        color={
                          activeRoute(route.path.toLowerCase())
                            ? activeIcon
                            : textColor
                        }
                        me='18px'>
                        {route.icon}
                      </Box>
                      <Text
                        me='auto'
                        color={
                          activeRoute(route.path.toLowerCase())
                            ? activeColor
                            : textColor
                        }
                        fontWeight={
                          activeRoute(route.path.toLowerCase())
                            ? "bold"
                            : "normal"
                        }>
                        {route.name}
                      </Text>
                    </Flex>
                    <Box
                      h='36px'
                      w='4px'
                      bg={
                        activeRoute(route.path.toLowerCase())
                          ? brandColor
                          : "transparent"
                      }
                      borderRadius='5px'
                    />
                  </HStack>
                </Box>
              ) : (
                <Box>
                  <HStack
                    spacing={
                      activeRoute(route.path.toLowerCase()) ? "22px" : "26px"
                    }
                    py='5px'
                    ps='10px'>
                    <Text
                      me='auto'
                      color={
                        activeRoute(route.path.toLowerCase())
                          ? activeColor
                          : inactiveColor
                      }
                      fontWeight={
                        activeRoute(route.path.toLowerCase()) ? "bold" : "normal"
                      }>
                      {route.name}
                    </Text>
                    <Box h='36px' w='4px' bg='brand.400' borderRadius='5px' />
                  </HStack>
                </Box>
              )}
            </Box>
          </NavLink>
        );
      }
    });
  };
  //  BRAND
  return createLinks(routes);
}

export default SidebarLinks;