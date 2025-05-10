package net.minipia.repository;


import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import net.minipia.entity.Room;
import net.minipia.entity.RoomObject;

@Repository
public interface RoomObjectRepository extends JpaRepository<RoomObject, Long> {
	List<RoomObject> findAllByRoom(Room room);
}
