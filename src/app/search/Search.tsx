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
    Select,
    SelectItem,
} from '@nextui-org/react';
import {FoodItem} from '../types/nutrition';
import {FaInfo} from 'react-icons/fa';
import { IoAdd } from 'react-icons/io5';

interface SearchPageProps {
    onSelectFood: (food: FoodItem) => void; // Add prop for selection
}

const SearchPage: React.FC<SearchPageProps> = ({ onSelectFood }) => {
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const modalDisclosure = useDisclosure();

    const [query, setQuery] = useState<string>('');
    const [amount, setAmount] = useState<number>(100);
    const [prevUnit, setPrevUnit] = useState<string>('grams');
    const [unit, setUnit] = useState<string>('grams');
    const [foods, setFoods] = useState<FoodItem[]>([]);
    const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
    const [viewedFood, setViewedFood] = useState<FoodItem | null>(null); 
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const units = [
        {key: 'grams', label: 'g'},
        {key: 'ounces', label: 'oz'},
        {key: 'pounds', label: 'lbs'},
    ];
    const conversionRates: {[key: string]: number} = {
        grams: 1,
        ounces: 28.3495,
        pounds: 453.592,
    };

    const handleSearch = async () => {
        try {
            const res = await fetch(
                `/api/nutrition/searchFoods?query=${encodeURIComponent(query)}`,
            );
            if (!res.ok) {
                console.error('Error fetching data:', res.statusText);
                return;
            }
            const data = await res.json();
            setFoods(data);
        } catch (error) {
            console.error('Fetch failed:', error);
        }
    };

    const handleInfoClick = async (food: FoodItem) => {
        try {
            setIsLoading(true);
            const res = await fetch(
                `/api/nutrition/getFood?name=${encodeURIComponent(food.name)}`,
            );
            if (!res.ok) {
                console.error('Error fetching food details:', res.statusText);
                return;
            }
            const data = await res.json();
            setViewedFood({...food, ...data}); 
            modalDisclosure.onOpen();
        } catch (error) {
            console.error('Failed to fetch food details:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRowClick = (food: FoodItem) => {
        setSelectedFood(food);
    };

    const resetDrawer = () => {
        setSelectedFood(null);
        setQuery('');
        setFoods([]);
    };

    const handleUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setUnit(e.target.value);
        const amountInGrams = amount * conversionRates[prevUnit];
        const newAmount = amountInGrams / conversionRates[e.target.value];
        const roundedAmount = Math.round(newAmount * 100) / 100;
        setAmount(roundedAmount);
        setPrevUnit(e.target.value);
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

            <Drawer isOpen={isOpen} onOpenChange={onOpenChange} size="md">
                <DrawerContent>
                    {onClose => (
                        <>
                            <DrawerHeader>
                                <p className="text-lg font-bold">Food Search</p>
                            </DrawerHeader>
                            <DrawerBody>
                                <Input
                                    placeholder="Food Name"
                                    value={query}
                                    onChange={e => setQuery(e.target.value)}
                                    className="w-full mb-4"
                                />
                                <Button
                                    onPress={handleSearch}
                                    className="bg-green-500 text-white hover:bg-green-600 mb-4"
                                >
                                    Search
                                </Button>

                                <div className="h-[500px] overflow-y-auto border rounded-md">
                                    <Table
                                        aria-label="Food Search Results"
                                        isHeaderSticky
                                        selectionBehavior="replace"
                                        color="primary"
                                        selectionMode="single"
                                    >
                                        <TableHeader>
                                            <TableColumn>Name</TableColumn>
                                            <TableColumn>Info</TableColumn>
                                        </TableHeader>
                                        <TableBody
                                            isLoading={isLoading}
                                            items={foods}
                                            loadingContent="Loading..."
                                        >
                                            {(item: FoodItem) => (
                                                <TableRow key={item.name}>
                                                    <TableCell
                                                        onClick={() =>
                                                            handleRowClick(item)
                                                        }
                                                        className="cursor-pointer hover:bg-gray-100 transition"
                                                    >
                                                        {item.name}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Button
                                                            onPress={() =>
                                                                handleInfoClick(item)
                                                            }
                                                            className="bg-transparent text-white hover:text-blue-600"
                                                            isIconOnly
                                                        >
                                                            <FaInfo />
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            </DrawerBody>
                            {selectedFood && (
                                <div className="flex items-center space-x-4 p-4">
                                    <Input
                                        type="number"
                                        label="Amount"
                                        value={amount.toString()}
                                        onChange={e =>
                                            setAmount(Number(e.target.value))
                                        }
                                        className="w-1/4 mb-4"
                                    />
                                    <Select
                                        label="Unit"
                                        placeholder="Select a unit"
                                        selectedKeys={new Set([unit])}
                                        onSelectionChange={(keys) => {
                                            const selectedUnit = Array.from(keys)[0] as string;
                                            handleUnitChange({ target: { value: selectedUnit } } as React.ChangeEvent<HTMLSelectElement>);
                                        }}
                                        className="w-1/4 mb-4"
                                    >
                                        {units.map(u => (
                                            <SelectItem key={u.key} value={u.key}>
                                                {u.label}
                                            </SelectItem>
                                        ))}
                                    </Select>
                                    <Button
                                        color="primary"
                                        onPress={() => {
                                            if (selectedFood) {
                                                onSelectFood(selectedFood);
                                            }
                                            resetDrawer();
                                            onClose();
                                        }}
                                        className="bg-blue-500 text-white hover:bg-blue-600"
                                    >
                                        Add Selected Food
                                    </Button>
                                </div>
                            )}
                            <DrawerFooter>
                                <Button
                                    color="danger"
                                    variant="light"
                                    onPress={onClose}
                                    className="hover:bg-red-100 mr-2"
                                >
                                    Close
                                </Button>
                            </DrawerFooter>
                        </>
                    )}
                </DrawerContent>
            </Drawer>

            <Modal
                isOpen={modalDisclosure.isOpen}
                onOpenChange={modalDisclosure.onOpenChange}
                className="h-[500px] overflow-y-auto"
            >
                <ModalContent>
                    <ModalHeader>
                        {viewedFood?.name || 'Food Details'}
                    </ModalHeader>
                    <ModalBody>
                        {viewedFood ? (
                            <div>
                                <p>
                                    <strong>Calories:</strong>{' '}
                                    {viewedFood.calories || 'N/A'}
                                </p>
                                <p>
                                    <strong>Total Fat:</strong>{' '}
                                    {viewedFood.total_fat || 'N/A'}
                                </p>
                                <p>
                                    <strong>Carbohydrate:</strong>{' '}
                                    {viewedFood.carbohydrate || 'N/A'}
                                </p>
                                <p>
                                    <strong>Protein:</strong>{' '}
                                    {viewedFood.protein || 'N/A'}
                                </p>
                                <p>
                                    <strong>Fiber</strong>{' '}
                                    {viewedFood.fiber || 'N/A'}
                                </p>
                                {Object.entries(viewedFood).map(
                                    ([key, value]) => {
                                        if (
                                            [
                                                'name',
                                                'calories',
                                                'total_fat',
                                                'carbohydrate',
                                                'protein',
                                                'serving size',
                                                'fiber',
                                            ].includes(key)
                                        ) return null;
                                        return (
                                            <p key={key}>
                                                <strong>
                                                    {key.replace(/_/g, ' ')}:
                                                </strong>{' '}
                                                {value || 'N/A'}
                                            </p>
                                        );
                                    },
                                )}
                            </div>
                        ) : (
                            <p>No nutrition data available</p>
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