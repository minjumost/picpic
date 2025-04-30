package net.minipia.service;

import java.util.List;

import net.minipia.dto.CreateRoomResponseDTO;
import net.minipia.dto.ReadObjectsInRangeRequestDTO;
import net.minipia.dto.ReadObjectsInRangeResponseDTO;
import net.minipia.dto.PlaceObjectRequestDTO;

public interface RoomService {
	public CreateRoomResponseDTO createRoom();

	public void enterRoom(String code);

	List<ReadObjectsInRangeResponseDTO> readObjectsInRange(String code, ReadObjectsInRangeRequestDTO req);
	
	public void placeObject(PlaceObjectRequestDTO placeObjectRequestDTO);
}
