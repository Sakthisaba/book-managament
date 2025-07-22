import React from "react";
import { useEffect } from "react";
import { AppContext } from "../../context/Appcontext";
import { fetchAllBooks ,fetchFilteredBooks} from "../../service/api";
import { useMemo } from "react";
import "./BookDashboard.css";
import { MdModeEditOutline, MdDelete,MdArrowDownward } from "react-icons/md";
import Pagination from "../tablecomponents/Pagination";
import { deleteBook } from "../../service/api";
import BookForm from "./BookForm";
import DeletePopup from "./DeletePopup";
import hasPermission from "../../utils/permission";
import Filter from "./Filter";
import { Table, Thead, Tbody, Tr, Th, Td, TableContainer, Highlight,VStack, Flex, Center, Checkbox, Button, IconButton, } from "@chakra-ui/react";
import {Debouncer} from "../../utils/debounce";
import { useNavigate } from "react-router-dom";


export default function BookDashboard() {
 
  const tableLength = 10;
  const debouncer = new Debouncer();
  const [tablerange , setTablerange] = React.useState([1,10]);
  const [selectedBooks, setSelectedBooks] = React.useState([]);
  const [selectedFilters,setSelectedFilters] = React.useState(['author','genre','title']);
  const [showDeletepopup,setDeletepopup]= React.useState(false);
  const [deleteBookData, setDeleteBookData] = React.useState([]);
  const [searchText,setSearchText] = React.useState('');
  const { bookdata, setBookData, user, setAuthors, setGenre, authors,settotalbooks } = React.useContext(AppContext);
  const canEditBook = useMemo(() => hasPermission(user, "edit:book"), [user]);
  const canDeleteBook = useMemo(() => hasPermission(user, "delete:book"),[user]);
  const filterBySearch = (e, searchText) => {
    const searchValue = e ? e.target.value.toLowerCase() : searchText;
    //Apply debouncer for filterBySearch function
    if (!debouncer.debounce(filterBySearch, e)) return;
    setTablerange([1, 10]);
    setSearchText(searchValue);
    if (searchValue) {
      var filterby = "";
      if (selectedFilters.length > 0) {
        filterby = selectedFilters.toString();
      }
      fetchAllBooks(tableLength, tablerange, searchValue, filterby).then(
        (data) => {
          if (data.success) {
            React.startTransition(() => {
              settotalbooks(data.totalbooks);
              setBookData(data.books);
            });
          }
        }
      );
    } else {
      fetchAllBooks(tableLength, tablerange).then((data) => {
        if (data.success) {
          React.startTransition(() => {
            settotalbooks(data.totalbooks);
            setBookData(data.books);
          });
        }
      });
    }
  };

  //On apply filter in combination search.
  const onApplyFilter = (data) => {
    setSelectedFilters(data);
    if(searchText==null || searchText == undefined || searchText=='') return;
    filterBySearch(null, searchText);
  };

  //On apply pagination change
  const onPageRangeSelect = (selected) => {
    setTablerange([tableLength * (selected - 1), tableLength * selected]);
    setSelectedBooks([]);
    fetchAllBooksAfterUpdate(selected);
  };

  //fetchAllBooksAfterUpdate
  const fetchAllBooksAfterUpdate = (selected) => {
    selected = selected ? selected : 1;
    fetchAllBooks(tableLength, [selected * tableLength - tableLength + 1]).then(
      (data) => {
        if (data.success) {
          settotalbooks(data.totalbooks);
          setBookData(data.books);
        }
      }
    );
  };

  // on edit/delete a book
  const onSelectBOOK = (e, bookitem) => {
    if (e.target.checked) {
      setSelectedBooks([...selectedBooks, bookitem]);
    } else {
      setSelectedBooks(selectedBooks.filter((book) => book !== bookitem));
    }
  };

  // on bulk delete
  const onSelectAll = (e) => {
    if (e.target.checked) {
      var selectedbook = bookdata.map((item, index) => {
        if (index > tablerange[0] || index <= tablerange[1]) {
          return selectedBooks.includes(item) ? null : item;
        }
      });

      setSelectedBooks(selectedbook);
    } else {
      setSelectedBooks([]);
    }
  };

  //Asc / Dsc Sorting
  const filterByOrder = (e, sortType) => {
    setTablerange([1, 10]);
    const element = e.currentTarget;
    element.setAttribute(
      "sort",
      element.getAttribute("sort") === "ascending" ? "descending" : "ascending"
    );
    const sortBy = element.getAttribute("sort");
    fetchFilteredBooks(tableLength, [1], sortBy, sortType).then((data) => {
      if (data.success) {
        React.startTransition(() => {
          settotalbooks(data.totalbooks);
          setBookData(data.books);
        });
      }
    });
  };

  const navigate = useNavigate();

  const goto = (path) => {
    navigate(path);
  };


  return (
    <>
      <VStack w={"90%"} marginTop={"2vw"}>
    
        <Flex alignItems={"center"} justifyContent={"space-between"} w={"100%"}>
          <div className="SearchBar">
            <input
              type="text"
              id="searchText"
              placeholder="Search by title or author"
            onChange={filterBySearch}/>
           <Filter options={['author','genre','title']}  selectedFilters={selectedFilters}  setSelectedFilters={setSelectedFilters} onApplyFilter={onApplyFilter}></Filter>
      
          </div>
          <div>
            {hasPermission(user, "delete:book") &&selectedBooks.length>0 &&(<Button colorPalette={'gray'} variant="outline" marginRight={'2'} onClick={()=>{setDeletepopup(true)}}>Delete All</Button>)}
            {hasPermission(user, "add:book") && (
              <Button size="sm" key={'addbook'} colorScheme="orange" className="addBook" onClick={()=>goto('/addbook')}>Add Book</Button>
            )}
          </div>
        </Flex>
        <TableContainer className="tablecontainer" height={"50%"} w={"100%"}>
          <Table size="sm" variant="simple" colorScheme="gray">
            <Thead>
              <Tr>
                <Th display={'flex'} >{canDeleteBook && <Checkbox paddingRight={"2"} onChange={onSelectAll} />}
                    <Flex alignItems={'center'} justifyContent={'space-between'} width={'100%'}><span>Title</span> <MdArrowDownward className="SortIcon" width={'1.5vw'} sort={'ascending'} onClick={(e)=>filterByOrder(e,'title')}  height={'1.5vw'}/></Flex></Th>
                <Th><Flex alignItems={'center'} justifyContent={'space-between'} width={'100%'}><span>Author</span> <MdArrowDownward className="SortIcon" width={'1.5vw'} sort={'ascending'} onClick={(e)=>filterByOrder(e,'author')}  height={'1.5vw'}/></Flex></Th>
                <Th>ISBN</Th>
                <Th><Flex alignItems={'center'} justifyContent={'space-between'} width={'100%'}><span>Genre</span> <MdArrowDownward className="SortIcon" width={'1.5vw'} sort={'ascending'} onClick={(e)=>filterByOrder(e,'genre')}  height={'1.5vw'}/></Flex></Th>
                <Th><Flex alignItems={'center'} justifyContent={'space-between'} width={'100%'}><span>Copies</span> <MdArrowDownward className="SortIcon" width={'1.5vw'} sort={'ascending'} onClick={(e)=>{filterByOrder(e,'noofcopies')}}  height={'1.5vw'}/></Flex></Th>
                {(canEditBook || canDeleteBook) && <Th>Actions</Th>}
              </Tr>
            </Thead>
            <Tbody divideColor="red.400">
              {bookdata.map((item,index) => {
               
                return <Tr key={item.id}>
                  <Td
                    display={"flex"}
                    alignItems={"center"}
                    height={"fit-content"}
                    maxWidth={"20vw"}
                    overflowX={"scroll"}
                    padding={"1vw"}
                    key={item.id}
                    className={item.id}
                    book-id={item.id}
                  >
                    {canDeleteBook && <Checkbox paddingRight={"2"} onChange={(e)=>onSelectBOOK(e,item)} />}
                    {selectedFilters.includes('title')?<Highlight query={searchText} styles={{ px: '0.5', py: '1', bg: 'orange.100' }}>{item.title}</Highlight>:<Highlight query={''} styles={{ px: '0.5', py: '1', bg: 'orange.100' }}>{item.title}</Highlight>}
                  </Td>
                  <Td >
                  {selectedFilters.includes('author')?<Highlight query={searchText} styles={{ px: '1', py: '1', bg: 'orange.100' }}>{item.author.name}</Highlight>:<Highlight query={''} styles={{ px: '1', py: '1', bg: 'orange.100' }}>{item.author.name}</Highlight>}
                  </Td>
                  <Td>{item.isbn}</Td>
                  <Td isNumeric>
                  {selectedFilters.includes('genre')?<Highlight query={searchText} styles={{ px: '1', py: '1', bg: 'orange.100' }}>{item.genre}</Highlight>:<Highlight query={''} styles={{ px: '1', py: '1', bg: 'orange.100' }}>{item.genre}</Highlight>}
                  </Td>
                  <Td isNumeric>{item.noofcopies}</Td>
                  <Td display={'flex'} justifyContent={'space-around'} padding={'1vw'}  opacity={selectedBooks.length>0?'0.5':'1'} pointerEvents={selectedBooks.length>0?'none':'all'}>
                    {canEditBook && (
                 
                  <MdModeEditOutline  className="editicon" color="green.400" cursor={'pointer'} onClick={() => {goto('/editbook'+`?id=${item.id}`)}}/>
                    )}
                    {canDeleteBook && (
                      <MdDelete
                        className="deleteicon"
                        color="red.400"
                        paddingLeft={"1vw"}
                        cursor={"pointer"}
                        onClick={()=>{setDeletepopup(true);setDeleteBookData(item);}}
                      />
                    )}
                  </Td>
                  
                </Tr>
           })}
            </Tbody>
          </Table>
        </TableContainer>
        {showDeletepopup&&<DeletePopup  selectedBooks={selectedBooks} deleteBookData={deleteBookData} fetchAllBooksAfterUpdate={fetchAllBooksAfterUpdate} setSelectedBooks={setSelectedBooks} onClose={()=>setDeletepopup(false)} ></DeletePopup>}
        <Pagination onPageRangeSelect={onPageRangeSelect} ></Pagination>
        </VStack>
    </>
  );
}
