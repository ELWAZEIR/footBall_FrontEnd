import Button from "../ui/Button";
import Card from "../ui/Card";
import { Edit, Trash2 } from "lucide-react";
import { Uniform } from "../../hooks/useUniforms";

interface Props {
  uniforms: Uniform[];
  onEdit: (u: Uniform) => void;
  onDelete: (id: string) => void;
  searchTerm: string;
  filterStatus: string;
}

const UniformTable: React.FC<Props> = ({
  uniforms,
  onEdit,
  onDelete,
  searchTerm,
  filterStatus,
}) => {
  const filtered = uniforms.filter((uniform) => {
    const matchesSearch = uniform.player.fullName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "" ||
      (filterStatus === "paid" && uniform.hasPaid) ||
      (filterStatus === "unpaid" && !uniform.hasPaid) ||
      (filterStatus === "received" && uniform.hasReceived) ||
      (filterStatus === "pending" && !uniform.hasReceived);

    return matchesSearch && matchesStatus;
  });

  return (
    <Card>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left p-4">Player</th>
              <th className="text-left p-4">Birth Year</th>
              <th className="text-left p-4">Size</th>
              <th className="text-left p-4">Amount</th>
              <th className="text-left p-4">Payment</th>
              <th className="text-left p-4">Delivery</th>
              <th className="text-left p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => (
              <tr key={u._id} className="border-b hover:bg-gray-50">
                <td className="p-4 font-medium">{u.player.fullName}</td>
                <td className="p-4">{u.player.birthYear}</td>
                <td className="p-4">{u.size.replace("SIZE_", "")}</td>
                {/* <td className="p-4">{u.amount.toLocaleString()} EGP</td> */}
                <td className="p-4">
                  {u.amount ? u.amount.toLocaleString() : "0"} EGP
                </td>
                <td className="p-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      u.hasPaid
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {u.hasPaid ? "Paid" : "Unpaid"}
                  </span>
                </td>
                <td className="p-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      u.hasReceived
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {u.hasReceived ? "Received" : "Pending"}
                  </span>
                </td>
                <td className="p-4">
                  <Button
                    className="mr-2"
                    size="sm"
                    variant="secondary"
                    onClick={() => onEdit(u)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => onDelete(u._id)}
                    className="text-red-600 hover:text-red-700"
                    title="حذف اللاعب"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default UniformTable;
