import Card from "../ui/Card";
import { CheckCircle, XCircle } from "lucide-react";
import { Uniform } from "../../hooks/useUniforms";

interface Props {
  uniforms: Uniform[];
}

const UniformStats: React.FC<Props> = ({ uniforms }) => {
  const totalIncome = uniforms
    .filter((u) => u.hasPaid)
    .reduce((sum, u) => sum + u.amount, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Total Income</p>
            <p className="text-2xl font-bold text-green-600">
              {totalIncome.toLocaleString()} EGP
            </p>
          </div>
          <CheckCircle className="h-8 w-8 text-green-500" />
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Pending Payment</p>
            <p className="text-2xl font-bold text-red-600">
              {uniforms.filter((u) => !u.hasPaid).length}
            </p>
          </div>
          <XCircle className="h-8 w-8 text-red-500" />
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Pending Delivery</p>
            <p className="text-2xl font-bold text-yellow-600">
              {uniforms.filter((u) => !u.hasReceived).length}
            </p>
          </div>
          <XCircle className="h-8 w-8 text-yellow-500" />
        </div>
      </Card>
    </div>
  );
};

export default UniformStats;
