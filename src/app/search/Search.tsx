import React, {useState} from 'react';
import {
    Button,
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerBody,
    DrawerFooter,
    Input,
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Spacer,
    useDisclosure,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Pagination,
} from '@nextui-org/react';

// Define the type for a food nutrient
interface FoodNutrient {
    nutrientId: number;
    nutrientName: string;
    value: number;
    unitName: string;
}

// Define the type for the food item
interface FoodItem {
    fdcId: number;
    description: string;
    brandOwner?: string;
    brandName?: string; // New field
    gtinUpc?: string; // New field
    servingSize?: number; // New field
    servingSizeUnit?: string; // New field
    foodNutrients?: FoodNutrient[];
    foodCategory?: string;
}

const SearchPage: React.FC = () => {
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const modalDisclosure = useDisclosure();

    const [query, setQuery] = useState<string>('');
    const [brandOwner, setBrandOwner] = useState<string>('');
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [foods, setFoods] = useState<FoodItem[]>([]);
    const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const fetchData = async (page: number) => {
        setIsLoading(true);

        const payload = {
            query: query.trim(),
            dataType: ['Foundation', 'SR Legacy', 'Branded'],
            pageSize: 10,
            pageNumber: page,
            brandOwner: brandOwner || undefined,
        };

        const res = await fetch(
            `https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${process.env.NEXT_PUBLIC_FDC_API_KEY}`,
            {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(payload),
            },
        );

        const data = await res.json();
        setFoods(data.foods || []);
        setTotalPages(data.totalPages || 1);
        setIsLoading(false);
    };

    const handleSearch = () => {
        setPageNumber(1);
        fetchData(1);
    };

    const handleRowClick = (food: FoodItem) => {
        setSelectedFood(food);
        modalDisclosure.onOpen();
    };

    return (
        <div className="p-8">
            <p className="text-xl font-semibold mb-4">Search Page</p>
            <Button
                onPress={onOpen}
                className="bg-blue-500 text-white hover:bg-blue-600"
            >
                Open Food Search
            </Button>

            {/* Food Search Drawer */}
            <Drawer isOpen={isOpen} onOpenChange={onOpenChange} size="md">
                <DrawerContent>
                    {onClose => (
                        <>
                            <DrawerHeader>
                                <p className="text-lg font-bold">Food Search</p>
                            </DrawerHeader>
                            <DrawerBody>
                                {/* Search Inputs */}
                                <Input
                                    placeholder="Food Name"
                                    value={query}
                                    onChange={e => setQuery(e.target.value)}
                                    className="w-full mb-4"
                                />
                                <Input
                                    placeholder="Brand Owner"
                                    value={brandOwner}
                                    onChange={e =>
                                        setBrandOwner(e.target.value)
                                    }
                                    className="w-full mb-4"
                                />
                                <Button
                                    onPress={handleSearch}
                                    className="bg-green-500 text-white hover:bg-green-600 mb-4"
                                >
                                    Search
                                </Button>

                                {/* Table with Fixed Height */}
                                <div className="h-[500px] overflow-y-auto border rounded-md">
                                    <Table
                                        aria-label="Food Search Results"
                                        isHeaderSticky
                                    >
                                        <TableHeader>
                                            <TableColumn>Name</TableColumn>
                                            <TableColumn>
                                                Brand Owner
                                            </TableColumn>
                                        </TableHeader>
                                        <TableBody
                                            isLoading={isLoading}
                                            items={foods}
                                            loadingContent="Loading..."
                                        >
                                            {(item: FoodItem) => (
                                                <TableRow
                                                    key={item.fdcId}
                                                    onClick={() =>
                                                        handleRowClick(item)
                                                    }
                                                    className="cursor-pointer hover:bg-gray-100 transition"
                                                >
                                                    <TableCell>
                                                        {item.description}
                                                    </TableCell>
                                                    <TableCell>
                                                        {item.brandOwner ||
                                                            'N/A'}
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>

                                {/* Pagination */}
                                <div className="flex justify-center mt-4">
                                    <Pagination
                                        total={totalPages}
                                        page={pageNumber}
                                        onChange={page => {
                                            setPageNumber(page);
                                            fetchData(page);
                                        }}
                                        color="primary"
                                    />
                                </div>
                            </DrawerBody>
                            <DrawerFooter>
                                <Button
                                    color="danger"
                                    variant="light"
                                    onPress={onClose}
                                    className="hover:bg-red-100"
                                >
                                    Close
                                </Button>
                            </DrawerFooter>
                        </>
                    )}
                </DrawerContent>
            </Drawer>

            {/* Modal for Nutrition Information */}
            <Modal
                isOpen={modalDisclosure.isOpen}
                onOpenChange={modalDisclosure.onOpenChange}
                className="h-[500px] overflow-y-auto"
            >
                <ModalContent>
                    <ModalHeader>{selectedFood?.description}</ModalHeader>
                    <ModalBody>
                        <p>
                            <strong>Brand Owner:</strong>{' '}
                            {selectedFood?.brandOwner || 'N/A'}
                        </p>
                        <p>
                            <strong>Brand Name:</strong>{' '}
                            {selectedFood?.brandName || 'N/A'}
                        </p>
                        <p>
                            <strong>Description:</strong>{' '}
                            {selectedFood?.description || 'N/A'}
                        </p>
                        <p>
                            <strong>GTIN/UPC:</strong>{' '}
                            {selectedFood?.gtinUpc || 'N/A'}
                        </p>
                        <p>
                            <strong>Serving Size:</strong>{' '}
                            {selectedFood?.servingSize}{' '}
                            {selectedFood?.servingSizeUnit}
                        </p>

                        <Spacer y={1} />
                        <strong>Nutrients:</strong>
                        {selectedFood?.foodNutrients?.length ? (
                            <ul className="h-[300px] overflow-y-auto border rounded-md p-4">
                                {selectedFood.foodNutrients.map(
                                    (nutrient, index) => (
                                        <li key={index}>
                                            {nutrient.nutrientName}:{' '}
                                            {nutrient.value} {nutrient.unitName}
                                        </li>
                                    ),
                                )}
                            </ul>
                        ) : (
                            <p>No nutrients available</p>
                        )}
                    </ModalBody>

                    <ModalFooter>
                        <Button onPress={modalDisclosure.onClose}>Close</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    );
};

export default SearchPage;
