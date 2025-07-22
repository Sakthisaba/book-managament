import React , { useState,useEffect} from "react";
import {
    Button,
  ButtonGroup,
  HStack,
  IconButton
} from "@chakra-ui/react";

import { AppContext } from "../../context/Appcontext";
import { MdKeyboardArrowRight ,MdKeyboardArrowLeft } from "react-icons/md";



const Pagination = ({onPageRangeSelect}) => {
    const [page, setPage] = useState([]);
    const [selected, setSelectedPage] = useState(1);
    const [range, setRange] = useState([1, 3]);
    const { bookdata, tableLength, totalbooks } = React.useContext(AppContext);

    //on previous select
    const moveForward = () => {
      var newSelected = selected;
      if (selected < page.length) {
        newSelected++;
        setSelectedPage(selected + 1);
      }

      if (selected >= range[1]) {
        var newRange = [range[0] + 1, range[1] + 1];
        setRange(newRange);
      }
      onPageRangeSelect(newSelected);
    };


    //on next select
    const moveBack = () => {
      var newSelected = selected;
      if (selected >= 2) {
        newSelected--;
        setSelectedPage(selected - 1);
      }
      if (selected <= range[0]) {
        var newRange = [range[0] - 1, range[1] - 1];
        setRange(newRange);
      }
      onPageRangeSelect(newSelected);
    };

    //on page select
    const handleClick = (index) => {
      setSelectedPage(index);
      onPageRangeSelect(index);
    };

    useEffect(() => {
      if (totalbooks == 0 || totalbooks == undefined) {
        return;
      } 
      //set pages [1,2,3,4,5,.....]
      setPage(
        new Array(Math.ceil(totalbooks / tableLength)).fill().map((item, index) => index + 1)
      );
    }, [bookdata, totalbooks]);
  return (
   <HStack display={'flex'} justifyContent={'end'} w={'100%'} marginTop={'2vw'}>
      <ButtonGroup variant="ghost" size="sm" display={'flex'} alignItems={'center'}>
       
          <IconButton
            isDisabled={selected === 1} 
            onClick={moveBack}
            aria-label="Previous page"
             className="pagination-prev"
            icon={<MdKeyboardArrowLeft />}
          />
  

        <ButtonGroup>
          {page.map((page) => {
            const isSelected = selected === page; 
            return page < range[0] || page > range[1] ? null : (
              <Button key={page} size={'xs'} variant={isSelected ? "solid" : "outline"}  onClick={()=>handleClick(page)}>
                {page}
              </Button>
            );
          })}
        </ButtonGroup>

      
          <IconButton 
            isDisabled={range[1] === page.length-1} 
            onClick={moveForward}
            aria-label="Next page"
            className="pagination-next"
            icon={<MdKeyboardArrowRight />}
          />
      
      </ButtonGroup>
    </HStack>
  );
};

export default Pagination;
