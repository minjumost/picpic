package com.picpic.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.picpic.entity.Member;
import com.picpic.entity.Participant;
import com.picpic.entity.Session;

@Repository
public interface ParticipantRepository extends JpaRepository<Participant, Long> {
	boolean existsBySessionAndMember(Session session, Member member);

	boolean findBySession(Session session);

	List<Participant> findManyBySession(Session session);

	Optional<Participant> findBySessionAndMember(Session session, Member member);

	void deleteByMemberAndSession(Member member, Session session);

	void deleteByMember_MemberIdAndSession_SessionId(Long memberId, Long sessionId);
}
