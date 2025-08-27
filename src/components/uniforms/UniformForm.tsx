import Select from "../ui/Select";
import Input from "../ui/Input";

interface Props {
  players: any[];
  formData: {
    playerId: string;
    hasPaid: boolean;
    hasReceived: boolean;
    size: string;
    amount: string;
  };
  setFormData: React.Dispatch<React.SetStateAction<any>>;
}

const sizeOptions = [
  { value: "", label: "Select Size" },
  { value: "S", label: "S" },
  { value: "M", label: "M" },
  { value: "SIZE_6", label: "6" },
  { value: "SIZE_8", label: "8" },
  { value: "SIZE_10", label: "10" },
];

const UniformForm: React.FC<Props> = ({ players, formData, setFormData }) => {
  return (
    <div className="space-y-4">
      <Select
        label="Player"
        value={formData.playerId}
        onChange={(e) =>
          setFormData((prev: any) => ({ ...prev, playerId: e.target.value }))
        }
        options={[
          { value: "", label: "Select Player" },
          ...(players || []).map((p) => ({
            value: p._id,
            label: `${p.fullName} (${p.birthYear})`,
          })),
        ]}
      />

      <Select
        label="Size"
        value={formData.size}
        onChange={(e) =>
          setFormData((prev: any) => ({ ...prev, size: e.target.value }))
        }
        options={sizeOptions}
      />

      <Input
        label="Amount (EGP)"
        type="number"
        value={formData.amount}
        onChange={(e) =>
          setFormData((prev: any) => ({ ...prev, amount: e.target.value }))
        }
      />

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={formData.hasPaid}
          onChange={(e) =>
            setFormData((prev: any) => ({ ...prev, hasPaid: e.target.checked }))
          }
        />
        <label className="text-sm">Payment received</label>
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={formData.hasReceived}
          onChange={(e) =>
            setFormData((prev: any) => ({
              ...prev,
              hasReceived: e.target.checked,
            }))
          }
        />
        <label className="text-sm">Uniform delivered</label>
      </div>
    </div>
  );
};

export default UniformForm;
