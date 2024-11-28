import React, { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ClockArrowDown } from "lucide-react";

interface TimePickerProps {
  value?: string; // Hora inicial no formato "HH:mm"
  onChange?: (time: string) => void; // Callback para retornar o horário selecionado
}

export const TimePicker: React.FC<TimePickerProps> = ({ value, onChange }) => {
  const [selectedHour, setSelectedHour] = useState<string>(value?.split(":")[0] || "00");
  const [selectedMinute, setSelectedMinute] = useState<string>(value?.split(":")[1] || "00");
  
  const handleChange = (hour: string, minute: string) => {
    const time = `${hour}:${minute}`;
    onChange?.(time);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className=" py-2 w-[250px] bg-white rounded-md shadow-sm text-gray-900 hover:bg-gray-200 focus:ring-2 flex justify-between items-center px-4">
          {`${selectedHour}:${selectedMinute}`}

          <ClockArrowDown size={18} className="text-gray-800"/>
        </button>
      </PopoverTrigger>
      <PopoverContent className="flex space-x-4 p-4">
        {/* Selector for Hours */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Hora</label>
          <Select
            onValueChange={(value) => {
              setSelectedHour(value);
              handleChange(value, selectedMinute);
            }}
            defaultValue={selectedHour}
          >
            <SelectTrigger className="w-[80px]">
              <SelectValue placeholder="HH" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 24 }, (_, i) => (
                <SelectItem key={i} value={i.toString().padStart(2, "0")}>
                  {i.toString().padStart(2, "0")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Selector for Minutes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Minuto</label>
          <Select
            onValueChange={(value) => {
              setSelectedMinute(value);
              handleChange(selectedHour, value);
            }}
            defaultValue={selectedMinute}
          >
            <SelectTrigger className="w-[80px]">
              <SelectValue placeholder="MM" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 60 }, (_, i) => (
                <SelectItem key={i} value={i.toString().padStart(2, "0")}>
                  {i.toString().padStart(2, "0")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default TimePicker;
