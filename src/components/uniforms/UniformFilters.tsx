import { Search, Plus } from "lucide-react";
import Input from "../ui/Input";
import Select from "../ui/Select";
import Button from "../ui/Button";

interface Props {
  searchTerm: string;
  setSearchTerm: (v: string) => void;
  filterStatus: string;
  setFilterStatus: (v: string) => void;
  onAdd: () => void;
}

const UniformFilters: React.FC<Props> = ({
  searchTerm,
  setSearchTerm,
  filterStatus,
  setFilterStatus,
  onAdd,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search players..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          options={[
            { value: "", label: "All Status" },
            { value: "paid", label: "Paid" },
            { value: "unpaid", label: "Unpaid" },
            { value: "received", label: "Received" },
            { value: "pending", label: "Pending Delivery" },
          ]}
        />
      </div>
      <Button onClick={onAdd} className="flex items-center">
        <Plus className="h-4 w-4 mr-2" />
        Add Uniform
      </Button>
    </div>
  );
};

export default UniformFilters;
